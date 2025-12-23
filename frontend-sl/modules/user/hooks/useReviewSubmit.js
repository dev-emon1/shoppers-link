import { useDispatch } from "react-redux";
import { submitItemReview } from "@/modules/user/store/orderReducer";
import { showToast } from "@/lib/utils/toast";

export default function useReviewSubmit(order, vendorOrder) {
  const dispatch = useDispatch();

  const submit = async ({ texts, ratings, media }) => {
    try {
      for (const item of vendorOrder.items) {
        if (!ratings[item.unid] || !texts[item.unid]) {
          showToast("All products must be reviewed", "error");
          return;
        }

        await dispatch(
          submitItemReview({
            orderUnid: order.unid,
            vendorOrderId: vendorOrder.id,
            itemId: item.id,
            payload: {
              rating: ratings[item.unid],
              body: texts[item.unid],
              media: media.map((m) => m.file),
            },
          })
        ).unwrap();
      }

      showToast("Review submitted successfully 🎉", "success");
    } catch (err) {
      showToast(err, "error");
    }
  };

  return { submit };
}
