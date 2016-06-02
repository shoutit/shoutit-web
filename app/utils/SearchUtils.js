import stringify from 'json-stable-stringify';

export function filtersObjectToUriComponent(filters) {
  const arr = [];
  Object.keys(filters).forEach(slug =>
    arr.push(`${slug}:${filters[slug]}`)
  );
  return arr.join(';');
}

export function uriComponentToFiltersObject(component) {
  let filters = {};
  component.split(';').forEach(qsFilter => {
    const filter = qsFilter.split(':');
    if (filter.length === 2) {
      filters = {
        ...filters,
        [filter[0]]: filter[1],
      };
    }
  });
  return filters;
}

export function getQuerystringFromSearchParams(params) {
  const { shout_type, category, min_price, max_price, search, filters, within } = params;
  let queryAsString = '';
  const query = [];
  if (shout_type && ['request', 'offer'].indexOf(shout_type) > -1) {
    query.push(`shout_type=${shout_type}`);
  }
  if (category) {
    query.push(`category=${category}`);
  }
  if (search) {
    query.push(`search=${encodeURIComponent(search)}`);
  }
  if (min_price) {
    query.push(`min_price=${min_price}`);
  }
  if (max_price) {
    query.push(`max_price=${max_price}`);
  }
  if (within && within !== 'city') {
    query.push(`within=${within}`);
  }

  if (filters) {
    const filtersUriComponent = filtersObjectToUriComponent(filters);
    if (filtersUriComponent) {
      query.push(`filters=${filtersUriComponent}`);
    }
  }
  if (query.length > 0) {
    queryAsString += `${query.join('&')}`;
  }
  return queryAsString;
}

export function getSearchParamsFromQuery(query) {
  const { shout_type, category, min_price, max_price, search } = query;

  let filters;
  if (query.filters) {
    filters = uriComponentToFiltersObject(query.filters);
  }
  const searchParams = {
    shout_type,
    category,
    search: search ? decodeURIComponent(search) : undefined,
    min_price: min_price ? parseInt(min_price, 10) : undefined,
    max_price: max_price ? parseInt(max_price, 10) : undefined,
    ...filters,
  };

  if (query.within && query.within !== 'city') {
    searchParams.within = isNaN(parseInt(query.within, 10)) ?
      query.within :
      parseInt(query.within, 10);
  }


  return searchParams;
}

export function stringifySearchParams(params) {
  return stringify(params);
}
