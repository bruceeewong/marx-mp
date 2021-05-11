class BiMap {
  constructor(obj) {
    const entries = Object.entries(obj);
    const reverseEntries = entries.map(([key, val]) => [val, key]);
    this.map = new Map(entries);
    this.reverseMap = new Map(reverseEntries);
  }

  getValue(key) {
    return this.map.get(key);
  }

  getKey(value) {
    return this.reverseMap.get(value);
  }

  convert(obj) {
    return this.convertByMap(this.map, obj);
  }

  reverseConvert(obj) {
    return this.convertByMap(this.reverseMap, obj);
  }

  keys() {
    return this.map.keys();
  }

  values() {
    return this.map.values();
  }

  convertByMap(map, obj) {
    const newObj = {};
    for (const [key, val] of Object.entries(obj)) {
      const newKey = map.get(key);
      if (newKey) {
        newObj[newKey] = val;
      } else {
        newObj[key] = val;
      }
    }
    return newObj;
  }
}

export default BiMap;
