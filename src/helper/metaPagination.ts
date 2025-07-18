type PaginationMeta = {
  total_items: number;
  total_pages: number;
  current_page: number;
  limit: number;
  first_page: number;
  last_page: number;
};

async function getPaginationMeta(
  model: any,
  filter: any,
  currentPage: number,
  limit: number
): Promise<PaginationMeta> {
  const totalItems = await model.countDocuments(filter);
  const totalPages = Math.ceil(totalItems / limit);

  return {
    total_items: totalItems,
    total_pages: totalPages,
    current_page: Number(currentPage),
    limit: Number(limit),
    first_page: 1,
    last_page: totalPages,
  };
}

export default getPaginationMeta;
