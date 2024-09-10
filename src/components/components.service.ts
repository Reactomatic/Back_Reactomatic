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

  async findByName(name: string): Promise<Component[]> {
    try {
      return await this.componentsRepository.find({ where: { name } });
    } catch (error) {
      this.logger.error(`Error finding components by name ${name}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve components by name');
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

  async searchPricesByName(id: number, name: string): Promise<{ priceByRetailer: any[] }> {
    const component = await this.findOne(id);
    console.log(`Searching prices for ${name}`);

    // Launch Puppeteer using puppeteer-extra with stealth
    const browser = await puppeteer
      .use(StealthPlugin())
      .launch({ headless: true });

    const retailers = [
      { name: 'Amazon FR', url: `https://www.amazon.fr/s?k=${name}`, priceSelector: '.a-price .a-offscreen', linkSelector: 'a.a-link-normal.a-text-normal' },
      { name: 'Amazon DE', url: `https://www.amazon.de/s?k=${name}`, priceSelector: '.a-price .a-offscreen', linkSelector: 'a.a-link-normal.a-text-normal' },
      { name: 'Newegg', url: `https://www.newegg.com/p/pl?d=${name}`, priceSelector: 'div.item-action', linkSelector: 'a[title="View Details"]' },
    ];

    const priceByRetailer = [];

    try {
      for (const retailer of retailers) {
        const page = await browser.newPage();
        await page.goto(retailer.url, { waitUntil: 'domcontentloaded' });

        try {
          if (retailer.name === 'Amazon FR' || retailer.name === 'Amazon DE') {
            console.log(`Searching for ${retailer.name} prices`);
            await page.waitForSelector(retailer.priceSelector, { timeout: 5000 });
            await page.waitForSelector(retailer.linkSelector, { timeout: 5000 });

            const priceElement = await page.$(retailer.priceSelector);
            const linkElement: ElementHandle<HTMLAnchorElement> = await page.$('a');
            if (priceElement && linkElement) {
              const price = await priceElement.evaluate(el => parseFloat(el.textContent.replace(/[^0-9,.]/g, '').replace(',', '.')));
              const link = await linkElement.evaluate(el => el.href);

              priceByRetailer.push({
                retailer: retailer.name,
                price,
                url: link,
              });
              console.log(`Price found for ${retailer.name}: ${price}`);
            }
          }

          // Custom logic for Newegg
          if (retailer.name === 'Newegg') {
            console.log(`Searching for ${retailer.name} prices`);
            await page.waitForSelector(retailer.priceSelector, { timeout: 5000 });

            const itemActionElement = await page.$(retailer.priceSelector);
            if (itemActionElement) {
              const itemInfoElement = await page.evaluateHandle(el => el.previousElementSibling, itemActionElement);
              if (itemInfoElement) {
                const linkElement = await itemInfoElement.$('a[title="View Details"]');
                const link = await linkElement.evaluate(el => el.href);

                let price;
                const priceCurrentElement = await itemActionElement.$('li.price-current');
                if (priceCurrentElement) {
                  const integerPartElement = await priceCurrentElement.$('strong');
                  const decimalPartElement = await priceCurrentElement.$('sup');
                  const integerPart = await integerPartElement.evaluate(el => el.textContent.replace(',', ''));
                  const decimalPart = await decimalPartElement.evaluate(el => el.textContent);
                  price = parseFloat(`${integerPart}.${decimalPart}`);
                }

                priceByRetailer.push({
                  retailer: retailer.name,
                  price,
                  url: link,
                });
                console.log(`Price found for ${retailer.name}: ${price}`);
              }
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

    if (priceByRetailer.length > 0) {
      const minPriceRetailer = priceByRetailer.reduce((prev, curr) => curr.price < prev.price ? curr : prev);
      component.price = minPriceRetailer.price;
      component.priceByRetailer = priceByRetailer;
      await this.componentsRepository.save(component);
    }

    return { priceByRetailer };
  }

  @Cron('0 0 0 * * *')
  async updatePrices(): Promise<void> {
    const arrayOfIDs = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41, 43, 45, 47, 49];
    for (const id of arrayOfIDs) {
      const component = await this.findOne(id);
      // Wait for 1 hour (3600000 milliseconds)
      console.log(`Updating prices for ${component.name}`);
      await this.searchPricesByName(id, component.name);
      console.log(`Prices updated for ${component.name}`);
      console.log(`Waiting for 1 minute before updating prices for next component to not get blocked by the websites`);
      //change from 1h to 10 seconds for testing purposes

      //change for 1 minutes
      await new Promise(resolve => setTimeout(resolve, 60000));
    }
  }
}
