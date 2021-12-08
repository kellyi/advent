const expect = require("expect");

const { findFuelCostsForPartTwo } = require("../src/20217");

describe("findFuelCostsForPartTwo", () => {
  let input = {
    position: undefined,
    count: 1,
    positions: [Infinity, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  };

  describe("when the starting position is 1", () => {
    it("returns the a list of position costs", () => {
      input["position"] = 1;
      const [{ position, count, positions }] = findFuelCostsForPartTwo([input]);
      expect(position).toBe(1);
      expect(count).toBe(1);
      expect(positions[5]).toEqual(10);
    });
  });

  describe("when the starting position is 2", () => {
    it("returns the a list of position costs", () => {
      input["position"] = 2;
      const [{ position, count, positions }] = findFuelCostsForPartTwo([input]);
      expect(position).toBe(2);
      expect(count).toBe(1);
      expect(positions[5]).toEqual(6);
    });
  });

  describe("when the starting position is 7", () => {
    it("returns the a list of position costs", () => {
      input["position"] = 7;
      const [{ position, count, positions }] = findFuelCostsForPartTwo([input]);
      expect(position).toBe(7);
      expect(count).toBe(1);
      expect(positions[5]).toEqual(3);
    });
  });

  describe("when the starting position is 14", () => {
    it("returns the a list of position costs", () => {
      input["position"] = 14;
      const [{ position, count, positions }] = findFuelCostsForPartTwo([input]);
      expect(position).toBe(14);
      expect(count).toBe(1);
      expect(positions[5]).toEqual(45);
    });
  });

  describe("when the starting position is 16", () => {
    describe("when the count is 1", () => {
      it("returns the a list of position costs", () => {
        input["position"] = 16;
        input["count"] = 1;
        const [{ position, count, positions }] = findFuelCostsForPartTwo([
          input,
        ]);
        expect(position).toBe(16);
        expect(count).toBe(1);
        expect(positions[5]).toEqual(66);
      });
    });

    describe("when the count is 1", () => {
      it("returns the a list of position costs", () => {
        input["position"] = 16;
        input["count"] = 2;
        const [{ position, count, positions }] = findFuelCostsForPartTwo([
          input,
        ]);
        expect(position).toBe(16);
        expect(count).toBe(2);
        expect(positions[5]).toEqual(66 * 2);
      });
    });
  });
});
