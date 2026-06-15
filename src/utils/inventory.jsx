// utils/updateInventory.js

// export const updateInventory = (
//   product,
//   orderItem
// ) => {

//   const updated = structuredClone(product);

//   const {
//     qty,
//     colors,
//     sizes
//   } = orderItem;

//   updated.stock = Math.max(
//     0,
//     updated.stock - qty
//   );

//   updated.total_items = Math.max(
//     0,
//     updated.total_items - qty
//   );

//   const colorData =
//     updated.colors_match?.[colors];

//   if (colorData) {

//     colorData.qty = Math.max(
//       0,
//       colorData.qty - qty
//     );

//     if (colorData.qty === 0) {

//       colorData.matching_sizes =
//         colorData.matching_sizes.filter(
//           size => size !== sizes
//         );
//     }
//   }

//   updated.sizes = [
//     ...new Set(
//       Object.values(updated.colors_match)
//         .flatMap(
//           color =>
//             color.matching_sizes || []
//         )
//     )
//   ];

//   return {
//     stock: updated.stock,
//     total_items: updated.total_items,
//     sizes: updated.sizes,
//     colors_match: updated.colors_match
//   };
// };

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

  const colorData =
    updated.colors_match?.[colors];

  if (colorData) {

    // Find the requested size
    const sizeIndex =
      colorData.matching_sizes.findIndex(
        ([sizeName]) =>
          String(sizeName) === String(sizes)
      );

    if (sizeIndex !== -1) {

      // Reduce qty for that size
      colorData.matching_sizes[sizeIndex][1] =
        Math.max(
          0,
          Number(
            colorData.matching_sizes[sizeIndex][1]
          ) - Number(qty)
        );

      // Remove size if no inventory left
      if (
        colorData.matching_sizes[sizeIndex][1] === 0
      ) {

        colorData.matching_sizes.splice(
          sizeIndex,
          1
        );
      }
    }

    // Recalculate color total
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
      Object.values(updated.colors_match)
        .flatMap(color =>
          (color.matching_sizes || [])
            .map(([sizeName]) => sizeName)
        )
    )
  ];

  return {
    stock: updated.stock,
    total_items: updated.total_items,
    sizes: updated.sizes,
    colors_match: updated.colors_match
  };
};