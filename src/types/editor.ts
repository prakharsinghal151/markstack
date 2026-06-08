import type {
  IPosition,
  IRange,
  Selection,
  editor as MonacoEditor,
} from "monaco-editor";

export type EditorPosition = IPosition;
export type EditorRange = IRange;
export type EditorSelection = Selection;
export type EditorModel = MonacoEditor.ITextModel;
export interface EditorVisiblePosition {
  top: number;
  left: number;
  height: number;
}
export type EditorEdit = MonacoEditor.IIdentifiedSingleEditOperation;
export type EditorInstance = MonacoEditor.IStandaloneCodeEditor;
