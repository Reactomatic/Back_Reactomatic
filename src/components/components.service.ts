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
    const component = this.componentsRepository.create(createComponentDto);
    return await this.componentsRepository.save(component);
  }

  async findAll(): Promise<Component[]> {
    return await this.componentsRepository.find();
  }

  async findOne(id: number): Promise<Component> {
    const component = await this.componentsRepository.findOne({ where: { id } });
    if (!component) {
      throw new NotFoundException(`Component with ID ${id} not found`);
    }
    return component;
  }

  async findByCategory(category: ComponentType): Promise<Component[]> {
    return await this.componentsRepository.find({ where: { category } });
  }

  async update(id: number, updateComponentDto: UpdateComponentDto): Promise<Component> {
    await this.componentsRepository.update(id, updateComponentDto);
    const updatedComponent = await this.componentsRepository.findOne({ where: { id } });
    if (!updatedComponent) {
      throw new NotFoundException(`Component with ID ${id} not found`);
    }
    return updatedComponent;
  }

  async remove(id: number): Promise<void> {
    const result = await this.componentsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Component with ID ${id} not found`);
    }
  }

  async searchPricesByName(id: number, searchPriceDto: SearchPriceDto): Promise<{ priceByRetailer: any[] }> {
    const { name } = searchPriceDto;
    const { brand } = searchPriceDto;
    const component = await this.findOne(id);
    const browser = await puppeteer.launch({ headless: true });
    const retailers = [
      { name: 'Amazon FR', url: `https://www.amazon.fr/s?k=${name}+${brand}`, priceSelector: '.a-price .a-offscreen', linkSelector: 'a.a-link-normal.a-text-normal' },
      { name: 'Amazon DE', url: `https://www.amazon.de/s?k=${name}+${brand}`, priceSelector: '.a-price .a-offscreen', linkSelector: 'a.a-link-normal.a-text-normal' },
      { name: 'Newegg', url: `https://www.newegg.com/p/pl?d=${name}+${brand}`, priceSelector: '.price-current', linkSelector: '.item-title' },
    ];
    const priceByRetailer = [];

    try {
      for (const retailer of retailers) {
        const page = await browser.newPage();
        await page.goto(retailer.url, { waitUntil: 'domcontentloaded' });

        try {
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
      // Trouver le prix le plus bas
      const minPriceRetailer = priceByRetailer.reduce((prev, curr) => curr.price < prev.price ? curr : prev);

      // Mettre à jour le composant avec le prix le plus bas
      component.price = minPriceRetailer.price;
      component.priceByRetailer = priceByRetailer;
      await this.componentsRepository.save(component);
    }

    return { priceByRetailer };
  }

}
