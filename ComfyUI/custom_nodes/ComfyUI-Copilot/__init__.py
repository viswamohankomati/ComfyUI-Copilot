'''
Author: ai-business-hql qingli.hql@alibaba-inc.com
Date: 2025-02-17 20:53:45
LastEditors: ai-business-hql qingli.hql@alibaba-inc.com
LastEditTime: 2025-06-24 17:09:23
FilePath: /comfyui_copilot/__init__.py
Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
'''
# Copyright (C) 2025 AIDC-AI
# Licensed under the MIT License.

import asyncio
import os
import server
from aiohttp import web
import folder_paths
from .backend.controller.conversation_api import *
from .backend.controller.llm_api import *
from .backend.controller.expert_api import *

WEB_DIRECTORY = "entry"
NODE_CLASS_MAPPINGS = {}
__all__ = ['NODE_CLASS_MAPPINGS']
version = "V2.1.0"

workspace_path = os.path.join(os.path.dirname(__file__))
comfy_path = os.path.dirname(folder_paths.__file__)
db_dir_path = os.path.join(workspace_path, "db")

dist_path = os.path.join(workspace_path, 'dist/copilot_web')
if os.path.exists(dist_path):
    server.PromptServer.instance.app.add_routes([
        web.static('/copilot_web/', dist_path),
    ])
else:
    print(f"🦄🦄🔴🔴Error: Web directory not found: {dist_path}")
