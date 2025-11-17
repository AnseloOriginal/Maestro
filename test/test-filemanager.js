const { expect } = require("chai");
const { init, getNotes } = require("../modules/filemanager.js");

describe("File Manager Functions", () => {
  it("should initilize without error", () => {
    expect(init).to.not.throw();
  });

  it("should return notes as array", () => {
    expect(getNotes()).to.be.an("array")
  });

});