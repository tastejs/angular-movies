import { CwvInterface } from '../typings/cwv.interface';
import * as fixtures from '../../fixtures/toolbar.fixtures';
import { GenreIds, CategoryNames } from '../../internals/typings';
import { Ufo, UserFlowContext } from '@push-based/user-flow';

export class ToolBarUfo extends Ufo implements CwvInterface {
  constructor(private ctx: UserFlowContext) {
    super(ctx);
  }

  async sendSerachForm() {
    await this.page.keyboard.type(fixtures.searchSubmitKeys[0]);
  }

  async fillSearchForm(query: string = 'pocahontas') {
    await this.page.waitForSelector(fixtures.searchSelector);
    await this.page.keyboard.type(query);
  }

  async toggleDarkmode(g: GenreIds) {
    throw new Error('not implemented');
  }

  async openAccountMenu(): Promise<any> {
    throw new Error('not implemented');
  }

  async awaitLCPContent(): Promise<any> {
    throw new Error('not implemented');
  }
}
