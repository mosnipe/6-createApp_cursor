import { TextService } from '../services/TextService';
import { AppError, ErrorCode } from '../types';

export class TextController {
  constructor(private textService: TextService) {}
  
  async getTexts(req: any, res: any, next: any) {
    try {
      const { eventId } = req.params;
      const texts = await this.textService.getTextsByEventId(eventId);
      res.json(texts);
    } catch (error) {
      next(error);
    }
  }
  
  async createText(req: any, res: any, next: any) {
    try {
      const { eventId } = req.params;
      const textData = req.body;
      const text = await this.textService.createText(eventId, textData);
      res.status(201).json(text);
    } catch (error) {
      next(error);
    }
  }
  
  async updateText(req: any, res: any, next: any) {
    try {
      const { id } = req.params;
      const textData = req.body;
      const text = await this.textService.updateText(id, textData);
      res.json(text);
    } catch (error) {
      next(error);
    }
  }
  
  async deleteText(req: any, res: any, next: any) {
    try {
      const { id } = req.params;
      await this.textService.deleteText(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
  
  async reorderTexts(req: any, res: any, next: any) {
    try {
      const { text_ids } = req.body;
      await this.textService.reorderTexts(text_ids);
      res.status(200).json({ message: 'Texts reordered successfully' });
    } catch (error) {
      next(error);
    }
  }
}
