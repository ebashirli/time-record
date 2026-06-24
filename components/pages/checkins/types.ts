export type CheckinRow = {
  "#": number;
  id: string;
  fullName: string;
  companyName: string;
  departmentName: string;
  positionName: string;
  checkedByName: string;
  gateName: string;
  dateTime: Date;
  direction: "In" | "Out";
};
