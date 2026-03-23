import { useRef, useState, useEffect } from "react";

import { BiCodeCurly } from "react-icons/bi";
import { BsGithub } from "react-icons/bs";
import { TbBrandHtml5, TbDownload, TbSettings2, TbUpload } from "react-icons/tb";

import useEditWithUndo from "@/hooks/useEditWithUndo";
import useLocale from "@/hooks/useLocale";

import { ResumeContent, SettingEditor } from "@/components/layout";
import { LangSwitch, LatestNotice, PrintPdfButton } from "@/components/toolkit";

import { exportHtml, exportJson, importJson } from "@/helpers/FileService";
import useModeStore from "@/stores/modeStore";

const Dashboard: React.FC = () => {
  const { locale } = useLocale();

  const { editorActive, setEditorActive } = useModeStore();

  const { startEdit: startEditProfile } = useEditWithUndo("profileStore");
  const { startEdit: startEditExperience } = useEditWithUndo("experienceStore");
  const { startEdit: startEditStyle } = useEditWithUndo("styleStore");

  const printComponentRef = useRef<HTMLDivElement>(null);

  const [isExportOpen, setIsExportOpen] = useState(false);
  const [editorWidth, setEditorWidth] = useState(400);
  const [isDragging, setIsDragging] = useState(false);

  const handleStartEdit = () => {
    startEditProfile();
    startEditExperience();
    startEditStyle();
    setEditorActive(true);
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newWidth = Math.min(Math.max(e.clientX - 20, 300), 800);
        setEditorWidth(newWidth);
      }
    };
    
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };
    
    if (isDragging) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging]);

  return (
    <>
      {/* 顶部栏 */}
      <div className="z-10 fixed print-hidden w-full p-2 bg-slate-600 text-white flex justify-between items-center">
        {/* 左侧设置按钮 */}
        {!editorActive && (
          <div className="flex justify-start md:ml-4">
            <button
              className="setting-button fixed top-4 max-sm:top-16 left-4 w-24"
              onClick={handleStartEdit}
            >
              <div className="flex items-center">
                <TbSettings2 className="mr-2" />
                <span className="text-xs">{locale.common.SETTING}</span>
              </div>
            </button>
          </div>
        )}

        {/* 标题 */}
        <div
          className={`flex-grow flex justify-center items-center ${
            editorActive ? "lg:ml-80" : ""
          } transition-all duration-500 ease-in-out`}
        >
          <a
            className="flex items-center my-2 mr-4"
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/RylanBot/resume-json-pdf"
          >
            <BsGithub className="w-6 h-6 mr-3" />
            <p className="text-2xl font-bold max-sm:text-sm whitespace-nowrap">resume-json-pdf</p>
          </a>
          {/* 语言切换 */}
          <LangSwitch />
        </div>

        {/* 右侧按钮 */}
        {!editorActive && (
          <>
            <div className="fixed">
              {/* 导入 */}
              <label className="setting-button right-40 max-sm:right-32 w-32 mr-4 cursor-pointer">
                <input
                  className="hidden"
                  type="file"
                  accept=".json"
                  onChange={(event) => {
                    if (event.target.files && event.target.files[0]) {
                      importJson(event.target.files[0]);
                      event.target.value = "";
                    }
                  }}
                />
                <div className="flex items-center">
                  <TbUpload className="mr-2" />
                  <span className="text-xs">{locale.common.IMPORT_JSON}</span>
                </div>
              </label>

              {/* 导出 */}
              <div
                className="fixed right-4 font-semibold text-sm text-slate-800"
                onClick={() => setIsExportOpen(!isExportOpen)}
                onMouseEnter={() => setIsExportOpen(true)}
                onMouseLeave={() => setIsExportOpen(false)}
              >
                <button className="setting-button right-4 w-32">
                  <TbDownload className="mr-2" />
                  <span className="text-xs">{locale.common.EXPORT_OPTIONS}</span>
                </button>
                {/* 下拉选项 */}
                {isExportOpen && (
                  <div className="bg-white mt-6 w-32 rounded-sm shadow-sm max-md:mt-14 max-md:scale-75">
                    <button
                      className="p-2 w-full text-left rounded-tl-sm rounded-tr-sm hover:bg-slate-100"
                      onClick={exportJson}
                    >
                      <div className="flex items-center px-5 py-1">
                        <BiCodeCurly className="mr-4" />
                        <span className="text-xs">JSON</span>
                      </div>
                    </button>
                    <button
                      className="p-2 w-full text-left hover:bg-slate-100"
                      onClick={exportHtml}
                    >
                      <div className="flex items-center px-5 py-1">
                        <TbBrandHtml5 className="mr-4" />
                        <span className="text-xs">HTML</span>
                      </div>
                    </button>
                    <PrintPdfButton printRef={printComponentRef} />
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* 编辑窗和简历内容的双栏布局 */}
      {editorActive ? (
        <div className="flex h-screen pt-14">
          {/* 编辑窗 - 可拖动宽度 */}
          <div
            style={{ width: `${editorWidth}px` }}
            className="flex-shrink-0 overflow-y-auto border-r border-gray-300 bg-white h-full"
          >
            <SettingEditor />
          </div>

          {/* 拖拽分割条 */}
          <div
            className="w-1 cursor-col-resize bg-gray-300 hover:bg-blue-400 active:bg-blue-500 transition-colors flex-shrink-0"
            onMouseDown={handleMouseDown}
          />

          {/* 简历内容 - 自适应剩余宽度 */}
          <div className="flex-1 overflow-y-auto">
            <ResumeContent ref={printComponentRef} />
          </div>
        </div>
      ) : (
        <>
          <ResumeContent ref={printComponentRef} />
          <LatestNotice />
        </>
      )}
    </>
  );
};

export default Dashboard;