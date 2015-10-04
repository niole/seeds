"use strict";
var $ = require('jquery');
var React = require('react');

var Test = React.createClass({
  render: function () {
    return (
      <h1>test</h1>
    );
  }
});

$(document).ready(function() {
  React.render(<Test/>, document.body);
});
