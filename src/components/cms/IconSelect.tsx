import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import { getIconComponent, AVAILABLE_ICONS } from '../../utils/iconMap';

interface IconSelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export function IconSelect({ value, onChange, label = 'Icon' }: IconSelectProps) {
  return (
    <FormControl fullWidth size="small">
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        label={label}
        onChange={(e) => onChange(e.target.value)}
        renderValue={(v) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {(() => {
              const Icon = getIconComponent(v);
              return <Icon size={20} strokeWidth={2} />;
            })()}
            <span>{v}</span>
          </Box>
        )}
      >
        {AVAILABLE_ICONS.map((name) => {
          const Icon = getIconComponent(name);
          return (
            <MenuItem key={name} value={name}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Icon size={20} strokeWidth={2} />
                <span>{name}</span>
              </Box>
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}
