fetch('data.json')
  .then(response => response.json())
  .then(data => {
    const width = 1000;
    const height = 800;

    const svg = d3.select('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(40,0)');

    const root = d3.stratify()
      .id(d => d.id)
      .parentId(d => d.padres[0] || null)(data);

    const treeLayout = d3.tree().size([height, width - 160]);
    treeLayout(root);

    svg.selectAll('.link')
      .data(root.links())
      .enter().append('path')
      .attr('class', 'link')
      .attr('d', d3.linkHorizontal()
        .x(d => d.y)
        .y(d => d.x));

    const node = svg.selectAll('.node')
      .data(root.descendants())
      .enter().append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.y},${d.x})`);

    node.append('circle').attr('r', 5);

    node.append('text')
      .attr('dy', 3)
      .attr('x', d => d.children ? -8 : 8)
      .style('text-anchor', d => d.children ? 'end' : 'start')
      .text(d => d.data.nombre_griego);

    const tooltip = d3.select('.tooltip');

    node.on('mouseover', (event, d) => {
      tooltip.style('display', 'block')
        .html(`<strong>${d.data.nombre_griego}${d.data.nombre_romano ? ' / ' + d.data.nombre_romano : ''}</strong><br>${d.data.descripcion}`)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY + 10) + 'px');
    }).on('mouseout', () => {
      tooltip.style('display', 'none');
    });
  });
