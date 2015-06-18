define([], function () {
  var io = window.io;
  window.io = null;

  return io;
});