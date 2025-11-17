const { expect } = require("chai");
const { getStatusURL, apiJoin } = require("../modules/api.js");

describe("Electron Web AI Functions", () => {
  it("should return the server status", () => {
    expect(getStatusURL()).to.equal("http://192.168.1.2/server/status");
  });

  it("should join the values", () => {
    expect(apiJoin("tests", "test")).to.equal("tests/test");
  });

});