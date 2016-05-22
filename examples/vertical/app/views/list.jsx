var React = require('react');

var Layout = require('./layout.jsx');

var CreateForm = React.createClass({
  render: function() {
    return (<Layout title={this.props.title}>
      <table class="mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp">
        <thead>
          <tr>
            <th class="mdl-data-table__cell--non-numeric">Username</th>
          </tr>
        </thead>
        <tbody>
          {this.props.users.map(function(user, i) {
            return (<tr key="{i}">
              <td class="mdl-data-table__cell--non-numeric">{user.username}</td>
            </tr>);
          })}
        </tbody>
      </table>
    </Layout>);
  }
});

module.exports = CreateForm;
