import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";
import p4 from "@/assets/p4.jpg";
import p5 from "@/assets/p5.jpg";
import p6 from "@/assets/p6.jpg";

export type PropertyType = "Office" | "R&D / Flex" | "Mixed-Use" | "Campus";
export type Status = "For Lease" | "Investment Sale" | "Fully Leased";

export interface Property {
  id: string;
  name: string;
  address: string;
  submarket: string;
  type: PropertyType;
  status: Status;
  sf: number;
  availableSf: number;
  floors: number;
  yearBuilt: number;
  rentPsf: number;
  salePrice?: number;
  capRate?: number;
  occupancy: number;
  image: string;
  amenities: string[];
  certifications: string[];
  /** Position on the interactive map placeholder, in percent of canvas. */
  x: number;
  y: number;
  featured?: boolean;
}

export const properties: Property[] = [
  {
    id: "MR-1042",
    name: "Meridian Ridge Center",
    address: "1042 Meridian Pkwy, Northlake",
    submarket: "Northlake Corridor",
    type: "Office",
    status: "For Lease",
    sf: 268000,
    availableSf: 48200,
    floors: 6,
    yearBuilt: 2019,
    rentPsf: 42.5,
    salePrice: 74500000,
    capRate: 6.1,
    occupancy: 82,
    image: p1,
    amenities: ["Fitness center", "Conference hub", "EV charging", "On-site café"],
    certifications: ["LEED Platinum", "WiredScore Gold"],
    x: 26,
    y: 30,
    featured: true,
  },
  {
    id: "HV-0311",
    name: "Hartwell Vantage Park",
    address: "311 Hartwell Row, Ashford",
    submarket: "Ashford Tech Belt",
    type: "Campus",
    status: "Investment Sale",
    sf: 412000,
    availableSf: 61500,
    floors: 4,
    yearBuilt: 2015,
    rentPsf: 38.75,
    salePrice: 121500000,
    capRate: 5.8,
    occupancy: 85,
    image: p2,
    amenities: ["Collaboration courtyard", "Shuttle to transit", "Bike workshop", "Daycare"],
    certifications: ["LEED Gold", "Energy Star 92"],
    x: 63,
    y: 22,
  },
  {
    id: "CV-0870",
    name: "Cobalt Vista Tower",
    address: "870 Cobalt Ave, Riverfront",
    submarket: "Riverfront District",
    type: "Office",
    status: "For Lease",
    sf: 331500,
    availableSf: 22400,
    floors: 12,
    yearBuilt: 2021,
    rentPsf: 51.25,
    salePrice: 158000000,
    capRate: 5.4,
    occupancy: 93,
    image: p3,
    amenities: ["Sky lounge", "Concierge", "Tenant app", "Valet parking"],
    certifications: ["LEED Platinum", "WELL Core"],
    x: 44,
    y: 58,
    featured: true,
  },
  {
    id: "SV-2210",
    name: "Summit Verde Commons",
    address: "2210 Verde Trail, Glenwood",
    submarket: "Glenwood Green",
    type: "R&D / Flex",
    status: "For Lease",
    sf: 186000,
    availableSf: 66000,
    floors: 3,
    yearBuilt: 2012,
    rentPsf: 29.5,
    salePrice: 41500000,
    capRate: 7.2,
    occupancy: 64,
    image: p4,
    amenities: ["Loading docks", "Lab-ready shells", "Solar canopy", "Walking trails"],
    certifications: ["LEED Silver", "BOMA 360"],
    x: 78,
    y: 52,
  },
  {
    id: "LP-0455",
    name: "Lakeshore Pointe IV",
    address: "455 Lakeshore Dr, Eastvale",
    submarket: "Eastvale Lakes",
    type: "Office",
    status: "Fully Leased",
    sf: 142000,
    availableSf: 0,
    floors: 5,
    yearBuilt: 2008,
    rentPsf: 34.0,
    salePrice: 38200000,
    capRate: 6.6,
    occupancy: 100,
    image: p5,
    amenities: ["Waterfront terrace", "Auditorium", "Secure garage", "Car wash"],
    certifications: ["BOMA 360", "Energy Star 88"],
    x: 18,
    y: 66,
  },
  {
    id: "QX-0130",
    name: "Quarry Exchange",
    address: "130 Quarry St, Mill District",
    submarket: "Mill District",
    type: "Mixed-Use",
    status: "For Lease",
    sf: 96500,
    availableSf: 31200,
    floors: 4,
    yearBuilt: 2023,
    rentPsf: 46.0,
    salePrice: 52400000,
    capRate: 5.9,
    occupancy: 68,
    image: p6,
    amenities: ["Retail colonnade", "Rooftop bar", "Co-working floor", "Dog run"],
    certifications: ["LEED Gold", "Fitwel 2 Star"],
    x: 60,
    y: 78,
  },
];

export const submarkets = [
  "All submarkets",
  "Northlake Corridor",
  "Ashford Tech Belt",
  "Riverfront District",
  "Glenwood Green",
  "Eastvale Lakes",
  "Mill District",
];

export const propertyTypes: Array<"All types" | PropertyType> = [
  "All types",
  "Office",
  "Campus",
  "R&D / Flex",
  "Mixed-Use",
];

export const stats = [
  { label: "Assets under management", value: "18.4M", unit: "sq ft" },
  { label: "Portfolio occupancy", value: "94.2", unit: "%" },
  { label: "Institutional clients", value: "310", unit: "+" },
  { label: "Avg. lease cycle", value: "21", unit: "days" },
];

export const services = [
  {
    title: "Asset & property management",
    body: "Full-stack operations for office parks: tenant coordination, CAM reconciliation, vendor procurement and 24/7 engineering response.",
    icon: "building",
  },
  {
    title: "Leasing & tenant representation",
    body: "Data-driven rent comps, stack plans and tour scheduling through the portal, with live availability synced to your CRM.",
    icon: "key",
  },
  {
    title: "Capital markets & dispositions",
    body: "Underwriting, offering memoranda and curated buyer lists for single assets or entire office park portfolios.",
    icon: "chart",
  },
  {
    title: "ESG & sustainability reporting",
    body: "Utility benchmarking, LEED recertification tracks and audit-ready reporting for institutional LP requirements.",
    icon: "leaf",
  },
];

export const testimonial = {
  quote:
    "Meridian brought six buildings under one operating standard in ninety days. Occupancy is up 11 points and our reporting cycle went from weeks to a single dashboard.",
  name: "Dana Whitfield",
  title: "VP, Real Estate — NorthBridge Capital",
};

export const logos = [
  "NORTHBRIDGE",
  "ATLAS TRUST",
  "KESSLER GROUP",
  "VANTAGE REIT",
  "ORION HOLDINGS",
  "PALISADE PARTNERS",
];
