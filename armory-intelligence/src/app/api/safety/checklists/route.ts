/**
 * @file safety/checklists/route.ts
 * @description GET /api/safety/checklists - Fetch safety checklists from database
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");

    // Build query conditions
    const where = category ? { category } : {};

    // Fetch checklists from database
    const checklists = await prisma.safetyChecklist.findMany({
      where,
      orderBy: { category: "asc" },
    });

    // If no database results, return mock data
    if (checklists.length === 0) {
      const mockChecklists = [
        {
          id: "storage-1",
          category: "storage",
          title: "Firearm Storage Safety Checklist",
          items: JSON.stringify([
            { id: "s1", text: "Unload all firearms before storage", priority: "critical" },
            { id: "s2", text: "Store firearms in a locked safe or cabinet", priority: "critical" },
            { id: "s3", text: "Store ammunition separately from firearms", priority: "high" },
            { id: "s4", text: "Use trigger locks or cable locks as secondary security", priority: "medium" },
            { id: "s5", text: "Keep safe combination/keys secure and private", priority: "high" },
          ]),
          description: "Essential steps for safe firearm storage",
        },
        {
          id: "handling-1",
          category: "handling",
          title: "Safe Handling Checklist",
          items: JSON.stringify([
            { id: "h1", text: "Treat every firearm as if it's loaded", priority: "critical" },
            { id: "h2", text: "Never point at anything you're not willing to destroy", priority: "critical" },
            { id: "h3", text: "Keep finger off trigger until ready to shoot", priority: "critical" },
            { id: "h4", text: "Be sure of your target and what's beyond it", priority: "critical" },
          ]),
          description: "The four fundamental rules of firearms safety",
        },
        {
          id: "cleaning-1",
          category: "cleaning",
          title: "Cleaning Safety Checklist",
          items: JSON.stringify([
            { id: "c1", text: "Remove magazine and verify chamber is EMPTY", priority: "critical" },
            { id: "c2", text: "Double-check: visually and physically inspect chamber", priority: "critical" },
            { id: "c3", text: "Point firearm in safe direction during inspection", priority: "critical" },
            { id: "c4", text: "Work in well-ventilated area", priority: "high" },
            { id: "c5", text: "Keep ammunition out of cleaning area", priority: "critical" },
          ]),
          description: "Safety steps before and during firearm maintenance",
        },
        {
          id: "transport-1",
          category: "transport",
          title: "Transportation Checklist",
          items: JSON.stringify([
            { id: "t1", text: "Unload firearm completely before transport", priority: "critical" },
            { id: "t2", text: "Use a locked case or container", priority: "high" },
            { id: "t3", text: "Store ammunition separately from firearms", priority: "high" },
            { id: "t4", text: "Know and follow state and local transport laws", priority: "critical" },
            { id: "t5", text: "Keep firearm out of reach and out of sight", priority: "medium" },
          ]),
          description: "Guidelines for safe and legal firearm transportation",
        },
        {
          id: "range-1",
          category: "range",
          title: "Range Safety Checklist",
          items: JSON.stringify([
            { id: "r1", text: "Wear appropriate eye protection", priority: "critical" },
            { id: "r2", text: "Wear hearing protection", priority: "critical" },
            { id: "r3", text: "Keep muzzle pointed downrange at all times", priority: "critical" },
            { id: "r4", text: "Keep firearm unloaded until on firing line", priority: "high" },
            { id: "r5", text: "Follow all range commands immediately", priority: "critical" },
            { id: "r6", text: "Never go forward of the firing line when others are shooting", priority: "critical" },
          ]),
          description: "Essential safety rules for range and field use",
        },
      ];

      // Filter by category if specified
      const filtered = category 
        ? mockChecklists.filter(c => c.category === category)
        : mockChecklists;

      return NextResponse.json({
        success: true,
        data: filtered.map(c => ({
          ...c,
          items: JSON.parse(c.items),
        })),
      });
    }

    // Parse JSON items field from database results
    const parsedChecklists = checklists.map((checklist) => ({
      ...checklist,
      items: typeof checklist.items === "string" 
        ? JSON.parse(checklist.items) 
        : checklist.items,
    }));

    return NextResponse.json({
      success: true,
      data: parsedChecklists,
    });
  } catch (error) {
    console.error("Error fetching safety checklists:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch safety checklists",
      },
      { status: 500 }
    );
  }
}
