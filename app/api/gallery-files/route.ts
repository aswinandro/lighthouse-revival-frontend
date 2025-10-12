export const runtime = "edge"
import { NextResponse } from "next/server";

export async function GET() {
  // Hardcoded list of gallery images for Cloudflare compatibility
  const images = [
    "g (1).jpeg", "g (1).jpg", "g (10).jpg", "g (11).jpg", "g (12).jpg", "g (13).jpg", "g (14).jpg", "g (15).jpg", "g (16).jpg", "g (17).jpg", "g (18).jpg", "g (19).jpg", "g (2).jpeg", "g (2).jpg", "g (20).jpg", "g (21).jpg", "g (22).jpg", "g (23).jpg", "g (24).jpg", "g (25).jpg", "g (26).jpg", "g (27).jpg", "g (28).jpg", "g (29).jpg", "g (3).jpeg", "g (3).jpg", "g (30).jpg", "g (31).jpg", "g (32).jpg", "g (33).jpg", "g (34).jpg", "g (35).jpg", "g (36).jpg", "g (37).jpg", "g (38).jpg", "g (39).jpg", "g (4).jpeg", "g (4).jpg", "g (40).jpg", "g (41).jpg", "g (42).jpg", "g (43).jpg", "g (44).jpg", "g (45).jpg", "g (46).jpg", "g (47).jpg", "g (48).jpg", "g (49).jpg", "g (5).jpeg", "g (5).jpg", "g (50).jpg", "g (51).jpg", "g (52).jpg", "g (53).jpg", "g (54).jpg", "g (55).jpg", "g (56).jpg", "g (57).jpg", "g (58).jpg", "g (59).jpg", "g (6).jpeg", "g (6).jpg", "g (60).jpg", "g (61).jpg", "g (62).jpg", "g (63).jpg", "g (7).jpeg", "g (7).jpg", "g (8).jpg", "g (9).jpg"
  ];
  return NextResponse.json({ images });
}
