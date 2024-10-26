import { LoggerService } from './logger.service';

describe('LanguageService', () => {
  let service: LoggerService;

  beforeEach(() => {
    service = new LoggerService();
  });

  describe('disable', () => {
    it('should set log levels to empty array', () => {
      jest.spyOn(service, 'setLogLevels');
      service.disable();
      expect(service.setLogLevels).toHaveBeenCalledWith([]);
    });
  });
});
