export function filtersObjectToUriComponent(filters) {
  const arr = [];
  Object.keys(filters)
    .filter(slug => !!filters[slug])
    .forEach(slug => arr.push(`${slug}:${filters[slug]}`)
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
  const { shout_type, category, min_price, max_price, search, filters, within, free } = params;
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

  if (free) {
    query.push(`free=${free}`);
  } else {
    if (min_price) {
      query.push(`min_price=${min_price}`);
    }
    if (max_price) {
      query.push(`max_price=${max_price}`);
    }
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
  if (params.page) {
    query.push(`page=${params.page}`);
  }
  if (params.sort) {
    query.push(`sort=${params.sort}`);
  }
  if (query.length > 0) {
    queryAsString += `${query.join('&')}`;
  }
  return queryAsString;
}

/**
 * Returns the query to be consumed by the shouts API from
 * query params or url coming from an URL path.
 *
 * @export
 * @param {Object} params
 * @param {Object} location
 * @returns {Object}
 */
export function getSearchQuery(params, location) {
  const query = {};
  if (params.shout_type) {
    query.shout_type = params.shout_type;
  }
  if (params.search) {
    query.search = decodeURIComponent(params.search);
  }
  if (params.category) {
    query.category = params.category;
  }
  if (params.free) {
    query.max_price = 0;
  } else {
    if (params.min_price) {
      query.min_price = parseInt(params.min_price, 10);
    }
    if (params.max_price) {
      query.max_price = parseInt(params.max_price, 10);
    }
  }
  if (location) {
    switch (params.within) {
      case 'city':
        query.city = location.city;
        query.state = location.state;
        query.country = location.country;
        break;
      case 'state':
        query.state = location.state;
        query.country = location.country;
        break;
      case 'country':
        query.country = location.country;
        break;
      default: {
        if (params.within) {
          const within = parseInt(params.within, 10);
          if (!isNaN(within)) {
            query.within = within;
          }
        }
        if (location.latitude && location.longitude) {
          query.latitude = location.latitude;
          query.longitude = location.longitude;
        }
        if (location.city) {
          query.city = location.city;
        }
        if (location.state) {
          query.state = location.state;
        }
        if (location.country) {
          query.country = location.country;
        }
      }
    }
  }

  if (params.filters) {
    const filters = uriComponentToFiltersObject(params.filters);
    Object.keys(filters).forEach(slug => { query[slug] = filters[slug]; });
  }

  if (!isNaN(params.page)) {
    query.page = parseInt(params.page, 10);
  } else {
    query.page = 1;
  }

  if (params.sort) {
    query.sort = params.sort;
  }
  return query;
}

export function getSearchParamsFromQuery(query) {
  const {
    shout_type,
    category,
    min_price,
    max_price,
    search,
    page,
    sort,
    free,
  } = query;

  let filters;
  if (query.filters) {
    filters = uriComponentToFiltersObject(query.filters);
  }
  const searchParams = {
    shout_type,
    category,
    free: free === 'true',
    search: search ? decodeURIComponent(search) : undefined,
    min_price: min_price ? parseInt(min_price, 10) : undefined,
    max_price: max_price ? parseInt(max_price, 10) : undefined,
    page: page ? parseInt(page, 10) : undefined,
    ...filters,
    sort,
  };

  if (query.within && query.within !== 'city') {
    searchParams.within = isNaN(parseInt(query.within, 10)) ?
      query.within :
      parseInt(query.within, 10);
  }

  return searchParams;
}
