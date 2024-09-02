import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Component } from './entities/component.entity';
import { ComponentType } from 'src/enum/componentsType';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import * as cheerio from 'cheerio';

@Injectable()
export class ComponentsService {

  private readonly logger = new Logger(ComponentsService.name);

  constructor(
    @InjectRepository(Component)
    private componentsRepository: Repository<Component>,
    private readonly httpService: HttpService,
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

  async scrapePrices(name: string, brand: string): Promise<{ retailer: string, price: number, url: string }[]> {
    const productQueries = [
      { retailer: 'Amazon France', url: `https://www.amazon.fr/s?k=${encodeURIComponent(name)}+${encodeURIComponent(brand)}` },
      { retailer: 'Amazon Germany', url: `https://www.amazon.de/s?k=${encodeURIComponent(name)}+${encodeURIComponent(brand)}` },
      { retailer: 'Newegg', url: `https://www.newegg.com/p/pl?d=${encodeURIComponent(name)}+${encodeURIComponent(brand)}` },
    ];

    const prices = await Promise.all(
      productQueries.map(async ({ retailer, url }) => {
        this.logger.debug(`Fetching URL: ${url}`);

        let response;
        try {
          response = await lastValueFrom(this.httpService.get(url));
        } catch (err) {
          this.logger.error(`HTTP request failed for ${retailer} with URL: ${url}, error: ${err.message}`);
          return { retailer, price: NaN, url };
        }

        const html = response.data;
        // Logging the first 500 characters of the HTML response for examination
        this.logger.debug(`HTML response from ${retailer} (first 500 chars): ${html.substring(0, 500)}`);
        const $ = cheerio.load(html);

        let price: number = NaN;
        let priceStr: string;

        try {
          if (retailer.includes('Amazon')) {
            // Example selectors, these need to be verified and updated based on the actual HTML structure
            priceStr = $('#price_inside_buybox').text() || $('.a-price-whole').text();
            this.logger.debug(`Raw price string from ${retailer}: ${priceStr}`);
            if (priceStr) {
              priceStr = priceStr.replace(/,/g, '.'); // Replace commas with dots if necessary
              price = parseFloat(priceStr.replace(/[^\d.-]/g, ''));
              this.logger.debug(`Parsed price for ${retailer}: ${price}`);
            }
          } else if (retailer === 'Newegg') {
            priceStr = $('.price-current strong').text();
            this.logger.debug(`Raw price string from ${retailer}: ${priceStr}`);
            if (priceStr) {
              price = parseFloat(priceStr.replace(/[^\d.-]/g, ''));
              this.logger.debug(`Parsed price for ${retailer}: ${price}`);
            }
          }
        } catch (error) {
          this.logger.error(`Error parsing price from ${retailer} at ${url}: ${error.message}`);
        }

        if (isNaN(price)) {
          this.logger.warn(`Price parsed as NaN for ${retailer} from URL: ${url}`);
        }

        return { retailer, price, url };
      })
    );

    const validPrices = prices.filter(priceInfo => !isNaN(priceInfo.price) && priceInfo.price > 0);
    this.logger.debug(`Valid prices found: ${JSON.stringify(validPrices)}`);
    return validPrices;
  }
}
