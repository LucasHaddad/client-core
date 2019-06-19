import { Messages } from '../../../src/i18n/messages';

describe('Messages', () => {
  describe('Add', () => {
    it('should add new messages', () => {
      let messagesMock = { 'pt-BR': { translation: { test: 'teste' } } };
      Messages.add(messagesMock);
      expect(Messages.get()).toEqual(messagesMock);
    });
  });
});