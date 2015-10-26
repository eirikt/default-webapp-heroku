import React from 'react';

/*
 * Title component, expecting:
 *   'title' property
 *   'title' style class (for section element)
 */
var Title = ({title}) => (
    <section className='title'>{title}</section>
);

export default Title;
