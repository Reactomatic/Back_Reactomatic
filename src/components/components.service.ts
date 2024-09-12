import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Component } from './entities/component.entity';
import { ComponentType } from 'src/enum/componentsType';
import { SearchPriceDto } from './dto/search-price.dto';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';


import { ElementHandle } from 'puppeteer'; // Import ElementHandle from puppeteer types

import { Cron } from '@nestjs/schedule';

//puppeteer.use(StealthPlugin());


@Injectable()
export class ComponentsService {

  private readonly logger = new Logger(ComponentsService.name);

  constructor(
    @InjectRepository(Component)
    private componentsRepository: Repository<Component>,
  ) { }

  async create(createComponentDto: CreateComponentDto): Promise<Component> {
    try {
      const component = this.componentsRepository.create(createComponentDto);
      return await this.componentsRepository.save(component);
    } catch (error) {
      this.logger.error(`Error creating component: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to create component');
    }
  }


  async findAll(): Promise<Component[]> {
    try {
      return await this.componentsRepository.find();
    } catch (error) {
      this.logger.error(`Error finding all components: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve components');
    }
  }


  async findOne(id: number): Promise<Component> {
    try {
      const component = await this.componentsRepository.findOne({ where: { id } });
      if (!component) {
        throw new NotFoundException(`Component with ID ${id} not found`);
      }
      return component;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error finding component with ID ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve component');
    }
  }

  async findByCategory(category: ComponentType): Promise<Component[]> {
    try {
      return await this.componentsRepository.find({ where: { category } });
    } catch (error) {
      this.logger.error(`Error finding components by category ${category}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve components by category');
    }
  }

  async update(id: number, updateComponentDto: UpdateComponentDto): Promise<Component> {
    try {
      const result = await this.componentsRepository.update(id, updateComponentDto);
      if (result.affected === 0) {
        throw new NotFoundException(`Component with ID ${id} not found`);
      }
      return await this.findOne(id);  // Re-use findOne to get the updated component
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error updating component with ID ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to update component');
    }
  }


  async remove(id: number): Promise<void> {
    try {
      const result = await this.componentsRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Component with ID ${id} not found`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error removing component with ID ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to remove component');
    }
  }

  async searchPricesByName(id: number, name: string): Promise<{ mergedPriceByRetailer: any[] }> {
    const component = await this.findOne(id);
    console.log(`Searching prices for ${name}`);

    // Launch Puppeteer using puppeteer-extra with stealth
    const browser = await puppeteer
      .use(StealthPlugin())
      .launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--incognito'] },);

    const existingPriceByRetailer = component.priceByRetailer || []; // Get existing data

    const retailers = [
      { name: 'Amazon FR', url: `https://www.amazon.fr/s?k=${name}`, priceSelector: '.a-price .a-offscreen', linkSelector: 'a.a-link-normal.a-text-normal', domain: 'https://www.amazon.fr' },
      { name: 'Amazon DE', url: `https://www.amazon.de/s?k=${name}`, priceSelector: '.a-price .a-offscreen', linkSelector: 'a.a-link-normal.a-text-normal', domain: 'https://www.amazon.de' },
      { name: 'LDLC', url: `https://www.ldlc.com/recherche/${name}`, priceSelector: 'li.pdt-item div.basket div.price', linkSelector: 'li.pdt-item h3.title-3 a', domain: 'https://www.ldlc.com' },
      { name: 'Cybertek', url: `https://www.cybertek.fr/boutique/produit.aspx?q=${name}`, priceSelector: 'div.grb__liste-produit__liste__produit__achat__prix ', linkSelector: 'a.prod_txt_left', domain: 'https://www.cybertek.fr' },
    ];

    const newPriceByRetailer = [];

    try {
      for (const retailer of retailers) {
        const page = await browser.newPage();


        await page.goto(retailer.url, { waitUntil: 'domcontentloaded' });

        try {
          if (retailer.name === 'Amazon FR' || retailer.name === 'Amazon DE') {
            console.log(`Searching for ${retailer.name} prices`);
            await page.waitForSelector(retailer.priceSelector, { timeout: 5000 });
            await page.waitForSelector(retailer.linkSelector, { timeout: 5000 });

            // Fetch all result items to loop through them and filter out irrelevant content
            const productElements = await page.$$('.s-result-item');

            for (const productElement of productElements) {

              const sponsorLabel = await productElement.$('.a-color-base');
              const isSponsored = sponsorLabel && (await page.evaluate(el => (el as HTMLElement).innerText.includes('Sponsorisé'), sponsorLabel));

              if (isSponsored) {
                const wrongLink = await productElement.$eval('a.a-link-normal', el => el.href);  // Get the link of the sponsored item
                console.log(`Skipping sponsored item with link: ${wrongLink}`);
                continue;  // Skip the sponsored item
              }

              // Also check if the item actually contains a price (to skip ads or irrelevant items)
              const priceElement = await productElement.$(retailer.priceSelector);
              const linkElement = await productElement.$(retailer.linkSelector);

              if (!isSponsored && priceElement && linkElement) {
                const price = await priceElement.evaluate(el => {
                  let text = el.textContent.replace(/[^\d,]/g, '');  // Supprime tout sauf les chiffres et les virgules
                  text = text.replace(',', '');  // Enlève la virgule
                  text = text.slice(0, -2) + '.' + text.slice(-2);  // Ajoute un point avant les deux derniers chiffres
                  return parseFloat(text);  // Convertit le texte en nombre flottant
                });

                const link = await linkElement.evaluate(el => el.getAttribute('href'));
                console.log(`Link found: ${link}`);

                newPriceByRetailer.push({
                  retailer: retailer.name,
                  price,
                  url: `${retailer.domain}${link}`,
                });
                console.log(`Price found for ${retailer.name}: ${price}`);
                break;  // Stop the loop after finding the first price
              }
            }
          }
          if (retailer.name === 'LDLC') {
            console.log(`Searching for ${retailer.name} prices`);
            await page.waitForSelector(retailer.priceSelector, { timeout: 10000 });
            await page.waitForSelector(retailer.linkSelector, { timeout: 10000 });

            const priceElement = await page.$(retailer.priceSelector);
            const linkElement = await page.$(retailer.linkSelector);
            if (priceElement && linkElement) {

              const price = await priceElement.evaluate(el => {
                let text = el.textContent.replace(/[^\d,]/g, '');  // Supprime tout sauf les chiffres et les virgules
                text = text.replace(',', '');  // Enlève la virgule
                text = text.slice(0, -2) + '.' + text.slice(-2);  // Ajoute un point avant les deux derniers chiffres
                return parseFloat(text);  // Convertit le texte en nombre flottant
              })

              const link = await linkElement.evaluate(el => el.getAttribute('href'));
              console.log(link)

              newPriceByRetailer.push({
                retailer: retailer.name,
                price,
                url: `${retailer.domain}${link}`,
              });
              console.log(`Price found for ${retailer.name}: ${price}`);
            }

          }
          if (retailer.name === 'Cybertek') {
            console.log(`Searching for ${retailer.name} prices`);
            await page.waitForSelector(retailer.priceSelector, { timeout: 10000 });
            await page.waitForSelector(retailer.linkSelector, { timeout: 10000 });

            const priceElement = await page.$(retailer.priceSelector);
            const linkElement = await page.$(retailer.linkSelector);
            if (priceElement && linkElement) {

              const price = await priceElement.evaluate(el => {
                let text = el.textContent.replace(/[^\d,]/g, '');  // Supprime tout sauf les chiffres et les virgules
                text = text.replace(',', '');  // Enlève la virgule
                text = text.slice(0, -2) + '.' + text.slice(-2);  // Ajoute un point avant les deux derniers chiffres
                return parseFloat(text);  // Convertit le texte en nombre flottant
              })

              const link = await linkElement.evaluate(el => el.getAttribute('href'));
              console.log(link)

              newPriceByRetailer.push({
                retailer: retailer.name,
                price,
                url: `${link}`,
              });
              console.log(`Price found for ${retailer.name}: ${price}`);
            }
          }
        } catch (error) {
          this.logger.error(`Error searching prices for ${retailer.name}: ${error.message}`);
        }

        await page.close();
      }
    } catch (error) {
      this.logger.error(`Error in searchPricesByName: ${error.message}`);
    } finally {
      await browser.close();
    }

    const mergedPriceByRetailer = retailers.map(retailer => {
      const newEntry = newPriceByRetailer.find(entry => entry.retailer === retailer.name);
      const oldEntry = existingPriceByRetailer.find(entry => entry.retailer === retailer.name);
      return newEntry || oldEntry;
    }).filter(Boolean);

    if (mergedPriceByRetailer.length > 0) {
      component.priceByRetailer = mergedPriceByRetailer;
      await this.componentsRepository.save(component);
    }

    /*         // Check if prices were found for each retailer
        if (priceByRetailer.length === retailers.length) {
          console.log('All prices and links were found for all retailers');
        } else {
          console.log('Some prices or links were missing');
        }
    
        if (priceByRetailer.length > 0) {
          const minPriceRetailer = priceByRetailer.reduce((prev, curr) => curr.price < prev.price ? curr : prev);
          component.price = minPriceRetailer.price;
          component.priceByRetailer = priceByRetailer;
          await this.componentsRepository.save(component);
        } */

    return { mergedPriceByRetailer };
  }

  @Cron('0 0 0 * * *')
  async updatePrices(): Promise<void> {
    const arrayOfIDs = [1, 2, 3, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61];
    for (const id of arrayOfIDs) {
      const component = await this.findOne(id);
      console.log(`Updating prices for ${component.name}`);
      await this.searchPricesByName(id, component.name);
      console.log(`Prices updated for ${component.name}`);
      console.log(`Waiting for 1 minute before updating prices for next component to not get blocked by the websites`);

      //change for 1 minutes
      await new Promise(resolve => setTimeout(resolve, 60000));
    }
    console.log('All prices updated');
    return null;
  }
}
