export const runtime = "edge"
import { NextResponse } from "next/server";

export async function GET() {
  console.log("API /api/gallery-files called");
  try {
    const images = [
      "g_1_.jpeg", "g_1_.jpg", "g_10_.jpg", "g_11_.jpg", "g_12_.jpg", "g_13_.jpg", "g_14_.jpg", "g_15_.jpg", "g_16_.jpg", "g_17_.jpg", "g_18_.jpg", "g_19_.jpg", "g_2_.jpeg", "g_2_.jpg", "g_20_.jpg", "g_21_.jpg", "g_22_.jpg", "g_23_.jpg", "g_24_.jpg", "g_25_.jpg", "g_26_.jpg", "g_27_.jpg", "g_28_.jpg", "g_29_.jpg", "g_3_.jpeg", "g_3_.jpg", "g_30_.jpg", "g_31_.jpg", "g_32_.jpg", "g_33_.jpg", "g_34_.jpg", "g_35_.jpg", "g_36_.jpg", "g_37_.jpg", "g_38_.jpg", "g_39_.jpg", "g_4_.jpeg", "g_4_.jpg", "g_40_.jpg", "g_41_.jpg", "g_42_.jpg", "g_43_.jpg", "g_44_.jpg", "g_45_.jpg", "g_46_.jpg", "g_47_.jpg", "g_48_.jpg", "g_49_.jpg", "g_5_.jpeg", "g_5_.jpg", "g_50_.jpg", "g_51_.jpg", "g_52_.jpg", "g_53_.jpg", "g_54_.jpg", "g_55_.jpg", "g_56_.jpg", "g_57_.jpg", "g_58_.jpg", "g_59_.jpg", "g_6_.jpeg", "g_6_.jpg", "g_60_.jpg", "g_61_.jpg", "g_62_.jpg", "g_63_.jpg", "g_7_.jpeg", "g_7_.jpg", "g_8_.jpg", "g_9_.jpg"
    ];
    console.log("Returning images:", images);
    return NextResponse.json({ images });
  } catch (err) {
    console.error("Error in /api/gallery-files:", err);
    return NextResponse.json({ images: [] });
  }
}
