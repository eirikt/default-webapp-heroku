var React = require('react'),

    /*
     * Title component, expecting:
     *   'title' property
     *   'title' section style class
     */
    Title = React.createClass({
        render: function() {
            return (
                <section className='title'>{this.props.title}</section>
            );
        }
    });

module.exports = Title;
