"use client";

import React from "react";
import {
  Box,
  Button,
  Select,
  MenuItem,
  TextField,
  FormControl,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomNode, NodeData } from "../page";

const schema = z
  .object({
    name: z.string().optional(),
    habit: z.string().optional(),
    type: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "select" && !data.habit) {
      ctx.addIssue({
        path: ["habit"],
        message: "A habit must be selected.",
        code: "custom",
      });
    }
    if (data.type === "textfield" && (!data.name || data.name.trim() === "" || data.name.length < 3)) {
      ctx.addIssue({
        path: ["name"],
        message: "Name should not be empty and should be at least 3 characters long.",
        code: "custom",
      });
    }
  });

interface SidePanelProps {
  onSubmit: (data: NodeData) => void;
  selectedNode: CustomNode | null;
  isEditMode: boolean;
  activeTab: number;
}

const SidePanel: React.FC<SidePanelProps> = ({
  onSubmit,
  selectedNode,
  isEditMode,
  activeTab,
}) => {
  const { control, handleSubmit, formState: { errors } } = useForm<NodeData>({
    resolver: zodResolver(schema),
    values: {
      name: selectedNode?.data.name || "",
      habit: selectedNode?.data.habit || "",
      type: activeTab === 0 ? "textfield" : "select",
    },
  });

  const handleFormSubmit = (data: NodeData) => onSubmit(data);

  return (
    <Box sx={{ padding: 2, border: "1px solid #ccc", borderRadius: 4 }}>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        {activeTab === 0 ? (
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Node Name"
                error={!!errors.name}
                helperText={errors.name?.message}
                fullWidth
                sx={{ marginBottom: 2 }}
              />
            )}
          />
        ) : (
          <Controller
            name="habit"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth sx={{ marginBottom: 2 }}>
                <Select {...field} error={!!errors.habit} displayEmpty>
                  <MenuItem value="Reading">Reading</MenuItem>
                  <MenuItem value="Exercise">Exercise</MenuItem>
                </Select>
                {errors.habit && (
                  <p style={{ color: "red", marginTop: "4px" }}>
                    {errors.habit.message}
                  </p>
                )}
              </FormControl>
            )}
          />
        )}

        <Button type="submit" variant="contained" color="primary" fullWidth>
          {isEditMode ? "Save Node" : "Add Node"}
        </Button>
      </form>
    </Box>
  );
};

export default SidePanel;
