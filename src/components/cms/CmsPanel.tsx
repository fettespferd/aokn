import { useState, useCallback } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { ContentEditorPanel } from './ContentEditorPanel';
import { AssignmentBoard } from './AssignmentBoard';
import { LifeStageList } from './LifeStageList';
import { JsonExportButton } from './JsonExportButton';
import { JsonImportModal } from './JsonImportModal';
import { usePageStore } from '../../hooks/usePageStore';
import { initialPageData } from '../../data/initialData';

export function CmsPanel() {
  const {
    pageData,
    setSelectedLifeStageId,
    updatePageTitle,
    addTile,
    updateTile,
    deleteTile,
    reorderTiles,
    moveTileToSection,
    updateTileAssignmentForLifeStage,
    addTileToSectionForLifeStage,
    reorderTilesForLifeStage,
    addLifeStage,
    updateLifeStage,
    deleteLifeStage,
    setPageData,
  } = usePageStore();
  const [importOpen, setImportOpen] = useState(false);
  const [assignmentLifeStageId, setAssignmentLifeStageId] = useState<string | null>(null);

  const firstLifeStageId =
    [...(pageData.lifeStages ?? [])].sort((a, b) => a.sortOrder - b.sortOrder)[0]?.id ?? null;

  const handleAssignmentLifeStageChange = useCallback(
    (id: string | null) => {
      setAssignmentLifeStageId(id);
      const previewStageId = id ?? firstLifeStageId;
      setSelectedLifeStageId(previewStageId);
    },
    [setSelectedLifeStageId, firstLifeStageId]
  );

  const allTiles = [
    ...pageData.sections.helpful,
    ...pageData.sections.offers,
    ...(pageData.sections.wissenswertes ?? []),
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minWidth: 380,
        maxWidth: 420,
      }}
    >
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Seitentitel"
          value={pageData.pageTitle}
          onChange={(e) => updatePageTitle(e.target.value)}
          fullWidth
          size="small"
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <JsonExportButton pageData={pageData} />
          <Button variant="outlined" onClick={() => setImportOpen(true)} size="small">
            JSON importieren
          </Button>
          <Button
            variant="outlined"
            onClick={() => setPageData(initialPageData)}
            size="small"
            color="secondary"
          >
            Standard laden
          </Button>
        </Box>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
        <ContentEditorPanel
          tiles={allTiles}
          lifeStages={pageData.lifeStages ?? []}
          onAddTile={addTile}
          onUpdateTile={updateTile}
          onDeleteTile={deleteTile}
        />

        <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 2 }}>
          <AssignmentBoard
            pageData={pageData}
            assignmentLifeStageId={assignmentLifeStageId}
            onAssignmentLifeStageChange={handleAssignmentLifeStageChange}
            onMoveTile={moveTileToSection}
            onReorderInSection={reorderTiles}
            onReorderForLifeStage={reorderTilesForLifeStage}
            onUpdateAssignmentForLifeStage={updateTileAssignmentForLifeStage}
            onAddTileToSectionForLifeStage={addTileToSectionForLifeStage}
          />
        </Box>

        <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 2 }}>
          <LifeStageList
            lifeStages={pageData.lifeStages ?? []}
            onAdd={addLifeStage}
            onUpdate={updateLifeStage}
            onDelete={deleteLifeStage}
          />
        </Box>
      </Box>

      <JsonImportModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onImport={setPageData}
      />
    </Box>
  );
}
