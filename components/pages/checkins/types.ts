export type CheckinRow = {
  id: string;
  fullName: string;
  departmentName: string;
  checkedByName: string;
  dateTime: Date;
  direction: "In" | "Out";
};
