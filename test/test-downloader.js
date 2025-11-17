const { expect } = require("chai");
const { addDownload, downloadQueue } = require("../modules/downloader.js");

describe("Downloader Functions", () => {
  it("should new download list", () => {
    expect(addDownload("SS1 English")).to.equal(true);
  });

  it("should join the values", () => {
    expect(downloadQueue).to.be.an("array").that.does.include("SS1 English")
  });

});