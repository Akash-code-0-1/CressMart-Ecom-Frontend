export const getBreadcrumbPath = (allCategories: any[], targetId: string) => {
  const path: { name: string; slug: string }[] = [];
  let current = allCategories.find(c => c.id === targetId);

  while (current) {
    path.unshift({ name: current.name, slug: current.slug });
    // Find the parent
    current = allCategories.find(c => c.id === current.parent_id);
  }
  return path;
};