import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Component } from './entities/component.entity';
import { ComponentType } from 'src/enum/componentsType';
import { SearchPriceDto } from './dto/search-price.dto';
import * as puppeteer from 'puppeteer';


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
  

  //   async searchPricesByName(id: number, searchPriceDto: SearchPriceDto): Promise<{ priceByRetailer: any[] }> {
  //     const { name } = searchPriceDto;
  //     const { brand } = searchPriceDto;
  //     const component = await this.findOne(id);
  //     const browser = await puppeteer.launch({ headless: true });
  //     const retailers = [
  //       { name: 'Amazon FR', url: `https://www.amazon.fr/s?k=${name}+${brand}`, priceSelector: '.a-price .a-offscreen', linkSelector: 'a.a-link-normal.a-text-normal' },
  //       { name: 'Amazon DE', url: `https://www.amazon.de/s?k=${name}+${brand}`, priceSelector: '.a-price .a-offscreen', linkSelector: 'a.a-link-normal.a-text-normal' },
  //       //{ name: 'Newegg', url: `https://www.newegg.com/p/pl?d=${name}+${brand}`, priceSelector: '.price-current', linkSelector: '.item-title' },


  //     ];
  //     const priceByRetailer = [];

  //     try {
  //       for (const retailer of retailers) {
  //         const page = await browser.newPage();
  //         await page.goto(retailer.url, { waitUntil: 'domcontentloaded' });

  //         try {
  //           await page.waitForSelector(retailer.priceSelector, { timeout: 5000 });

  //           await page.waitForSelector(retailer.linkSelector, { timeout: 5000 });

  //           const priceElement = await page.$(retailer.priceSelector);
  //           const linkElement = await page.$(retailer.linkSelector) as puppeteer.ElementHandle<HTMLAnchorElement>;

  //           if (priceElement && linkElement) {
  //             const price = await priceElement.evaluate(el => parseFloat(el.textContent.replace(/[^0-9,.]/g, '').replace(',', '.')));
  //             const link = await linkElement.evaluate(el => el.href);

  //             priceByRetailer.push({
  //               retailer: retailer.name,
  //               price,
  //               url: link,
  //             });
  //           }
  //         } catch (error) {
  //           // Log specific errors for each retailer
  //           this.logger.error(`Error searching prices for ${retailer.name}: ${error.message}`);
  //         }

  //         await page.close();
  //       }
  //     } catch (error) {
  //       this.logger.error(`Error in searchPricesByName: ${error.message}`);
  //     } finally {
  //       await browser.close();
  //     }

  //     if (priceByRetailer.length > 0) {
  //       // Trouver le prix le plus bas
  //       const minPriceRetailer = priceByRetailer.reduce((prev, curr) => curr.price < prev.price ? curr : prev);

  //       // Mettre à jour le composant avec le prix le plus bas
  //       component.price = minPriceRetailer.price;
  //       component.priceByRetailer = priceByRetailer;
  //       await this.componentsRepository.save(component);
  //     }

  //     return { priceByRetailer };
  //   }

  // }


  async searchPricesByName(id: number, searchPriceDto: SearchPriceDto): Promise<{ priceByRetailer: any[] }> {
    const { name } = searchPriceDto;
    const { brand } = searchPriceDto;
    const component = await this.findOne(id);
    const browser = await puppeteer.launch({ headless: true });
    const retailers = [
      { name: 'Amazon FR', url: `https://www.amazon.fr/s?k=${name}+${brand}`, priceSelector: '.a-price .a-offscreen', linkSelector: 'a.a-link-normal.a-text-normal' },
      { name: 'Amazon DE', url: `https://www.amazon.de/s?k=${name}+${brand}`, priceSelector: '.a-price .a-offscreen', linkSelector: 'a.a-link-normal.a-text-normal' },
      { name: 'Newegg', url: `https://www.newegg.com/p/pl?d=${name}+${brand}`, priceSelector: 'div.item-action', linkSelector: 'a[title="View Details"]' }, // Updated selector for Newegg
    ];
    const priceByRetailer = [];

    try {
      for (const retailer of retailers) {
        const page = await browser.newPage();
        await page.goto(retailer.url, { waitUntil: 'domcontentloaded' });

        try {
          // Logic for Amazon FR and Amazon DE remains unchanged
          if (retailer.name === 'Amazon FR' || retailer.name === 'Amazon DE') {
            await page.waitForSelector(retailer.priceSelector, { timeout: 5000 });
            await page.waitForSelector(retailer.linkSelector, { timeout: 5000 });

            const priceElement = await page.$(retailer.priceSelector);
            const linkElement = await page.$(retailer.linkSelector) as puppeteer.ElementHandle<HTMLAnchorElement>;

            if (priceElement && linkElement) {
              const price = await priceElement.evaluate(el => parseFloat(el.textContent.replace(/[^0-9,.]/g, '').replace(',', '.')));
              const link = await linkElement.evaluate(el => el.href);

              priceByRetailer.push({
                retailer: retailer.name,
                price,
                url: link,
              });
            }
          }

          // Custom logic for Newegg
          if (retailer.name === 'Newegg') {
            // Wait for the 'div.item-action' selector and link selector to appear
            await page.waitForSelector(retailer.priceSelector, { timeout: 5000 });

            // Get the first 'div.item-action' element
            const itemActionElement = await page.$(retailer.priceSelector); // Select first div.item-action

            if (itemActionElement) {
              // Get the sibling 'div.item-info'
              const itemInfoElement = await page.evaluateHandle(el => el.previousElementSibling, itemActionElement);

              if (itemInfoElement) {
                // Get the link within 'div.item-info' with the title "View Details"
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

                // Push the price and URL for Newegg
                priceByRetailer.push({
                  retailer: retailer.name,
                  price,
                  url: link,
                });

                // Exit the loop after processing the first match for Newegg
                break;
              } else {
                console.log('No matching div.item-info found for the first div.item-action');
              }
            } else {
              console.log('Item action element not found');
            }
          }
        } catch (error) {
          // Log specific errors for each retailer
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
      // Find the lowest price
      const minPriceRetailer = priceByRetailer.reduce((prev, curr) => curr.price < prev.price ? curr : prev);

      // Update component with the lowest price
      component.price = minPriceRetailer.price;
      component.priceByRetailer = priceByRetailer;
      await this.componentsRepository.save(component);
    }

    return { priceByRetailer };
  }
}
