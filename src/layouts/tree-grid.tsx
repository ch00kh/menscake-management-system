import * as React from "react"
import { ChevronRightIcon, FolderIcon, PlusIcon, SearchIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FullPage } from "@/components/erp/page"
import { PaneHeader } from "@/components/erp/page-header"
import { RecordTable, TableFooterBar } from "@/components/erp/record-table"
import { treeData } from "@/data/mock"

type Node = { label: string; children?: Node[] }

function TreeNode({
  node,
  depth = 0,
  selected,
  onSelect,
}: {
  node: Node
  depth?: number
  selected: string
  onSelect: (label: string) => void
}) {
  if (!node.children) {
    return (
      <button
        type="button"
        onClick={() => onSelect(node.label)}
        style={{ paddingInlineStart: 12 + depth * 14 }}
        className={cn(
          "flex w-full items-center gap-1.5 rounded-md py-1.5 pe-2 text-left text-sm hover:bg-accent hover:text-accent-foreground",
          selected === node.label && "bg-accent font-medium"
        )}
      >
        <span className="size-3.5 shrink-0" />
        <span className="truncate">{node.label}</span>
      </button>
    )
  }

  return (
    <Collapsible defaultOpen>
      <CollapsibleTrigger
        render={
          <button
            type="button"
            style={{ paddingInlineStart: 12 + depth * 14 }}
            className="group flex w-full items-center gap-1.5 rounded-md py-1.5 pe-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
          />
        }
      >
        <ChevronRightIcon className="size-3.5 shrink-0 text-muted-foreground transition-transform group-data-panel-open:rotate-90" />
        <FolderIcon className="size-4 shrink-0 text-muted-foreground" />
        <span className="truncate">{node.label}</span>
      </CollapsibleTrigger>
      <CollapsibleContent>
        {node.children.map((child) => (
          <TreeNode
            key={child.label}
            node={child}
            depth={depth + 1}
            selected={selected}
            onSelect={onSelect}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}

export function TreeGrid() {
  const [selected, setSelected] = React.useState("A-1 분류")

  return (
    <FullPage>
      <ResizablePanelGroup className="min-h-0 flex-1">
        <ResizablePanel defaultSize="22" minSize="15" maxSize="40">
          <div className="flex h-full flex-col">
            <PaneHeader
              title="분류 체계"
              actions={
                <Button variant="ghost" size="icon-sm" aria-label="분류 추가">
                  <PlusIcon />
                </Button>
              }
            />
            <div className="border-b p-2">
              <InputGroup>
                <InputGroupAddon>
                  <SearchIcon />
                </InputGroupAddon>
                <InputGroupInput placeholder="분류 검색" />
              </InputGroup>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-1">
                {treeData.map((node) => (
                  <TreeNode
                    key={node.label}
                    node={node}
                    selected={selected}
                    onSelect={setSelected}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize="78">
          <div className="flex h-full flex-col">
            <PaneHeader
              title={selected}
              count="선택한 분류의 항목"
              actions={
                <Button size="sm">
                  <PlusIcon data-icon="inline-start" />
                  항목 추가
                </Button>
              }
            />
            <ScrollArea className="flex-1">
              <RecordTable />
            </ScrollArea>
            <TableFooterBar />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </FullPage>
  )
}
