import { useState } from 'react';
import { Box, Chip, Stack, Typography } from '@mui/material';
import { MobileFrame } from './MobileFrame';
import { usePageStore } from '../../hooks/usePageStore';
import { DEVICE_PRESETS, type DevicePreset } from './devicePresets';
import { getTilesForPreview } from '../../utils/previewTiles';

const ZOOM_LEVELS = [100, 125, 150, 175, 200] as const;

export function PreviewPanel() {
  const { pageData, expandedTileId, selectedLifeStageId, setExpandedTileId, setSelectedLifeStageId } = usePageStore();
  const [device, setDevice] = useState<DevicePreset>(() =>
    DEVICE_PRESETS.find((d) => d.id === 'iphone-13-14') ?? DEVICE_PRESETS[0]
  );
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  const handleToggleTile = (tileId: string) => {
    setExpandedTileId(tileId ? tileId : null);
  };

  const tilesBySection = getTilesForPreview(pageData, selectedLifeStageId);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 600 }}>
          Gerätegröße
        </Typography>
        <Stack direction="row" flexWrap="wrap" gap={1} useFlexGap>
          {DEVICE_PRESETS.map((d) => (
            <Chip
              key={d.id}
              label={`${d.label} (${d.width}×${d.height})`}
              onClick={() => setDevice(d)}
              color={device.id === d.id ? 'primary' : 'default'}
              variant={device.id === d.id ? 'filled' : 'outlined'}
              size="small"
            />
          ))}
        </Stack>
      </Box>

      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 600 }}>
          Zoom (Barrierefreiheit)
        </Typography>
        <Stack direction="row" flexWrap="wrap" gap={1} useFlexGap>
          {ZOOM_LEVELS.map((z) => (
            <Chip
              key={z}
              label={`${z}%`}
              onClick={() => setZoomLevel(z)}
              color={zoomLevel === z ? 'primary' : 'default'}
              variant={zoomLevel === z ? 'filled' : 'outlined'}
              size="small"
            />
          ))}
        </Stack>
      </Box>

      <Box
        sx={{
          position: 'sticky',
          top: 24,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: 2,
          backgroundColor: 'grey.100',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          minHeight: 500,
          overflow: 'visible',
        }}
      >
        <MobileFrame
          pageTitle={pageData.pageTitle}
          lifeStages={pageData.lifeStages ?? []}
          selectedLifeStageId={selectedLifeStageId}
          onSelectLifeStage={(id) => setSelectedLifeStageId(id)}
          helpfulTiles={tilesBySection.helpful}
          offersTiles={tilesBySection.offers}
          wissenswertesTiles={tilesBySection.wissenswertes}
          expandedTileId={expandedTileId}
          onToggleTile={handleToggleTile}
          width={device.width}
          height={device.height}
          zoomLevel={zoomLevel}
        />
      </Box>
    </Box>
  );
}
