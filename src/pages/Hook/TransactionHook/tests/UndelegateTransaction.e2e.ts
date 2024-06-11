import { stakingScValidBlock } from '__mocks__/data';
import { WALLET_SOURCE_ORIGIN } from '__mocks__/data/constants';
import { DataTestIdsEnum } from 'localConstants/dataTestIds.enum';
import {
  expectElementToContainText,
  getByDataTestId,
  loginWithKeystore
} from 'utils/testUtils/puppeteer';

describe('Withdraw transaction hook tests', () => {
  it('should execute withdraw transaction successfully', async () => {
    await page.goto(
      `${WALLET_SOURCE_ORIGIN}/hook/transaction?receiver=${stakingScValidBlock.address}&value=0&gasLimit=350000000&data=unDelegate@0de0b6b3a7640000&callbackUrl=https://devnet.xexchange.com`,
      {
        waitUntil: 'domcontentloaded'
      }
    );

    await loginWithKeystore();
    await page.waitForSelector(getByDataTestId(DataTestIdsEnum.sendModal));
    expect(page.url()).toMatch(`${WALLET_SOURCE_ORIGIN}/send`);

    await expectElementToContainText({
      dataTestId: DataTestIdsEnum.confirmReceiver,
      text: stakingScValidBlock.address
    });

    await expectElementToContainText({
      dataTestId: DataTestIdsEnum.confirmAmount,
      text: '0'
    });

    await expectElementToContainText({
      dataTestId: DataTestIdsEnum.confirmFee,
      text: '0.0035495 xEGLD'
    });

    await expectElementToContainText({
      dataTestId: DataTestIdsEnum.confirmData,
      text: 'unDelegate@0de0b6b3a7640000'
    });

    await page.click(getByDataTestId(DataTestIdsEnum.sendTrxBtn));

    await expectElementToContainText({
      dataTestId: DataTestIdsEnum.transactionToastTitle,
      text: 'Processing transaction'
    });
  });
});
