import "reflect-metadata";
import { I18n } from '../../../src/i18n/i18n';

describe('I18n', () => {
  beforeEach(() => {
    jest.spyOn(window.navigator, 'language', 'get').mockReturnValue('pt-BR');
    I18n.init({});
  });

  describe('initI18next', () => {
    it('should init i18n with the right params', () => {
      expect(I18n.instance.language).toBe(window.navigator.language);
      expect(I18n.instance.options.keySeparator).toBe('::');
      expect(I18n.instance.options.nsSeparator).toBe(':::');
    });

    it('should init i18n with config options', () => {
      I18n.init({ fallbackLng: 'fr' });
      expect(I18n.instance.language).toBe(window.navigator.language);
      expect(I18n.instance.options.keySeparator).toBe('::');
      expect(I18n.instance.options.nsSeparator).toBe(':::');
      expect(I18n.instance.options.fallbackLng).toEqual(['fr']);
    });
  });

  describe('getI18nLanguage', () => {
    it('should get the i18n language', () => {
      expect(I18n.getLanguage()).toBe('pt-BR');
    });
  });

  describe('change18nLanguage', () => {
    it('should set the i18n language', () => {
      expect(I18n.instance.language).toBe('pt-BR');
      I18n.changeLanguage('en-US');
      expect(I18n.instance.language).toBe('en-US');
    });
  });
});
