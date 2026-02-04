function valueReport(v) {
  if (Array.isArray(v)) {
    var max = 12;
    var values = Array.from(v).slice(0, max);
    if (values.length == max) {
      var more = ` (${v.length - max} more)`;
      return `[Array object]: ${values.join(", ")}...${v.length - max !== 0 ? more : ""}`;
    }
    return `[Array object]: ${values.join(", ")}`;
  }
  if (typeof v == undefined) {
    return "undefined";
  }
  return "" + v;
}

module.exports = { valueReport };
