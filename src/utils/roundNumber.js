export default (num) => Math.round((num + Number.EPSILON) * 100) / 100;
