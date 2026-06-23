
export const updateInventory = (
  product,
  orderItem
) => {

  const updated = structuredClone(product);

  const {
    qty,
    colors,
    sizes
  } = orderItem;

  // Update global inventory
  updated.stock = Math.max(
    0,
    Number(updated.stock) - Number(qty)
  );

  updated.total_items = Math.max(
    0,
    Number(updated.total_items) - Number(qty)
  );

  // ✅ Increase sold count
  updated.sold =
    Number(updated.sold || 0) +
    Number(qty);

  const colorData =
    updated.colors_match?.[colors];

  if (colorData) {

    const sizeIndex =
      colorData.matching_sizes.findIndex(
        ([sizeName]) =>
          String(sizeName) === String(sizes)
      );

    if (sizeIndex !== -1) {

      colorData.matching_sizes[sizeIndex][1] =
        Math.max(
          0,
          Number(
            colorData.matching_sizes[sizeIndex][1]
          ) - Number(qty)
        );

      if (
        colorData.matching_sizes[sizeIndex][1] === 0
      ) {

        colorData.matching_sizes.splice(
          sizeIndex,
          1
        );
      }
    }

    colorData.qty =
      colorData.matching_sizes.reduce(
        (sum, [, sizeQty]) =>
          sum + Number(sizeQty),
        0
      );
  }

  // Rebuild available sizes list
  updated.sizes = [
    ...new Set(
      Object.values(updated.colors_match || {})
        .flatMap(color =>
          (color.matching_sizes || [])
            .map(([sizeName]) => sizeName)
        )
    )
  ];

  return {
    stock: updated.stock,
    total_items: updated.total_items,
    sold: updated.sold, // ✅ return sold
    sizes: updated.sizes,
    colors_match: updated.colors_match
  };
};