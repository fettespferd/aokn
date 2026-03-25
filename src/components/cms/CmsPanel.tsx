import { useState } from 'react';
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
    selectedLifeStageId,
    setSelectedLifeStageId,
    updatePageTitle,
    addTile,
    updateTile,
    deleteTile,
    updateTileAssignmentForLifeStage,
    addTileToSectionForLifeStage,
    reorderTilesForLifeStage,
    addLifeStage,
    updateLifeStage,
    deleteLifeStage,
    setPageData,
  } = usePageStore();
  const [importOpen, setImportOpen] = useState(false);

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
            assignmentLifeStageId={selectedLifeStageId}
            onAssignmentLifeStageChange={setSelectedLifeStageId}
            onReorderForLifeStage={reorderTilesForLifeStage}
            onUpdateAssignmentForLifeStage={updateTileAssignmentForLifeStage}
            onAddTileToSectionForLifeStage={addTileToSectionForLifeStage}
            onDeleteTile={deleteTile}
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
