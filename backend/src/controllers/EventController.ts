import { EventService } from '../services/EventService';
import { AppError, ErrorCode } from '../types';

export class EventController {
  constructor(private eventService: EventService) {}
  
  async createEvent(req: any, res: any, next: any) {
    try {
      const eventData = req.body;
      const event = await this.eventService.createEvent(eventData);
      res.status(201).json(event);
    } catch (error) {
      next(error);
    }
  }
  
  async getEvents(req: any, res: any, next: any) {
    try {
      const events = await this.eventService.getEvents();
      res.json(events);
    } catch (error) {
      next(error);
    }
  }
  
  async getEvent(req: any, res: any, next: any) {
    try {
      const { id } = req.params;
      const event = await this.eventService.getEventById(id);
      
      if (!event) {
        throw new AppError(ErrorCode.NOT_FOUND, 'Event not found', 404);
      }
      
      res.json(event);
    } catch (error) {
      next(error);
    }
  }
  
  async updateEvent(req: any, res: any, next: any) {
    try {
      const { id } = req.params;
      const eventData = req.body;
      const event = await this.eventService.updateEvent(id, eventData);
      res.json(event);
    } catch (error) {
      next(error);
    }
  }
  
  async deleteEvent(req: any, res: any, next: any) {
    try {
      const { id } = req.params;
      await this.eventService.deleteEvent(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
