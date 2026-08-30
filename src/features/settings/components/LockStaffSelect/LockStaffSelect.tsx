import { MenuSelect } from '../../../../components/MenuSelect/MenuSelect';

export function LockStaffSelect({
  staff,
  value,
  disabled,
  labelledBy,
  onChange,
}: {
  staff: { id: string; name: string }[];
  value: string;
  disabled?: boolean;
  labelledBy: string;
  onChange: (id: string) => void;
}) {
  return (
    <MenuSelect
      size="lock"
      options={staff.map((member) => ({ id: member.id, label: member.name }))}
      value={value}
      disabled={disabled}
      labelledBy={labelledBy}
      placeholder="Select staff"
      onChange={onChange}
    />
  );
}
