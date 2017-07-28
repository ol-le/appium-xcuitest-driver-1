import sinon from 'sinon';
import XCUITestDriver from '../../..';


describe('element commnads', () => {
  let driver = new XCUITestDriver();
  const fixtureXOffset = 100, fixtureYOffset = 200;
  let executeStub = sinon.stub(driver, 'execute');
  executeStub.returns([fixtureXOffset, fixtureYOffset]);
  let atomsElStub = sinon.stub(driver, 'useAtomsElement', (el) => el);
  let atomStub = sinon.stub(driver, 'executeAtom');
  atomStub.returns({x: 0, y: 0});

  afterEach(() => {
    executeStub.reset();
    atomsElStub.reset();
    atomStub.reset();
  });

  describe('getLocation for web elements', () => {
    const oldContext = driver.curContext;
    const webEl = {ELEMENT: '5000'};

    before(() => {
      driver.curContext = "fake web context";
    });

    after(() => {
      driver.curContext = oldContext;
    });

    it('should get location relative to scroll by default', async () => {
      const loc = await driver.getLocation(webEl);
      executeStub.calledOnce.should.be.false;
      atomStub.calledOnce.should.be.true;
      atomStub.firstCall.args[0].should.eql('get_top_left_coordinates');
      loc.x.should.equal(0);
      loc.y.should.equal(0);
    });

    it('should get location relative to document with abosluteWebLocations cap', async () => {
      driver.opts.absoluteWebLocations = true;
      const loc = await driver.getLocation(webEl);
      executeStub.calledOnce.should.be.true;
      atomStub.calledOnce.should.be.true;
      atomStub.firstCall.args[0].should.eql('get_top_left_coordinates');
      loc.x.should.equal(fixtureXOffset);
      loc.y.should.equal(fixtureYOffset);
    });
  });

});
