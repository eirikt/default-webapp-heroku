import React from 'react';

/*
 * Title component, expecting:
 *   'title' property
 *   'title' style class (for section element)
 */
var Title = (props) => (
    <section className='title'>{props.title}</section>
 );

export default Title;
