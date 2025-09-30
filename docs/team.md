<!-- markdownlint-disable MD022 MD033 -->

---
layout: page
title: Meet the Team
description: The people behind logsmith
sidebar: false
---

<script setup>
import {
  VPTeamPage,
  VPTeamPageTitle,
  VPTeamPageSection,
  VPTeamMembers
} from 'vitepress/theme'
import { core, contributors } from './_data/team'
</script>

<VPTeamPage>
  <VPTeamPageTitle>
    <template #title>Meet the Team</template>
    <template #lead>
      Logsmith is developed and maintained by a small team and a growing community of contributors.
    </template>
  </VPTeamPageTitle>
  <VPTeamMembers :members="core" />
  <VPTeamPageSection>
    <template #title>Contributors</template>
    <template #lead>
      Thank you to everyone who has contributed code, documentation, and ideas.
    </template>
    <template #members>
      <VPTeamMembers size="small" :members="contributors" />
    </template>
  </VPTeamPageSection>
</VPTeamPage>
