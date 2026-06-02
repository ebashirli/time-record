export type CheckinRow = {
  "#": number;
  id: string;
  fullName: string;
  companyName: string;
  departmentName: string;
  positionName: string;
  checkedByName: string;
  dateTime: Date;
  direction: "In" | "Out";
};
