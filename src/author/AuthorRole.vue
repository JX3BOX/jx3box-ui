<template>
    <div class="c-author-role" v-if="roles.length">
        <div class="u-label">
            <img svg-inline src="../../assets/img/author/star.svg" />
            <span>{{ $jx3boxT("jx3boxUi.authorRole.title", "作者角色") }}</span>
        </div>
        <div class="u-roles">
            <component
                :is="item.url ? 'a' : 'span'"
                class="u-role"
                :href="item.url"
                :target="item.url ? '_blank' : null"
                :style="roleStyle(item)"
                v-for="item in roles"
                :key="item.key"
            >
                <img class="u-role-icon" v-if="item.icon" :src="item.icon" />
                <span class="u-role-content">
                    <span class="u-role-name">{{ item.name }}</span>
                    <span class="u-role-server" v-if="item.server">@{{ item.server }}</span>
                </span>
            </component>
        </div>
    </div>
</template>

<script>
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
import { showSchoolIcon } from "@jx3box/jx3box-common/js/utils";
import i18nMixin from "../../i18n/mixin";

const { __Root, __cdn } = JX3BOX;

export default {
    name: "AuthorRole",
    mixins: [i18nMixin],
    props: {
        data: {
            type: Object,
            default: function () {
                return {};
            },
        },
    },
    computed: {
        roles: function () {
            const roles = this.normalizeRoles(this.data?.public_roles);
            return roles.map(this.normalizeRole).filter((item) => item.name);
        },
    },
    methods: {
        normalizeRoles: function (roles) {
            if (!roles) return [];
            if (Array.isArray(roles)) return roles;
            if (typeof roles === "string") {
                try {
                    const parsed = JSON.parse(roles);
                    return Array.isArray(parsed) ? parsed : [parsed];
                } catch (e) {
                    return roles
                        .split(/[,，]/)
                        .map((item) => item.trim())
                        .filter(Boolean);
                }
            }
            return [roles];
        },
        normalizeRole: function (role, index) {
            if (typeof role === "string") {
                return {
                    key: role + index,
                    name: role,
                };
            }

            const info = role?.role_info || role?.info || {};
            const name =
                role?.name ||
                role?.title ||
                role?.label ||
                role?.role_name ||
                role?.display_name ||
                role?.remark ||
                info?.name ||
                info?.title ||
                info?.label ||
                info?.role_name ||
                "";

            return {
                key: role?.id || role?.key || role?.val || name + index,
                name,
                server: role?.server || role?.role_server || role?.jx3_server || info?.server || info?.role_server || "",
                desc: role?.desc || role?.description || role?.summary || info?.desc || info?.description || "",
                url: this.normalizeLink(role?.url || role?.link || role?.href || info?.url || info?.link || ""),
                icon: this.normalizeIcon(role, info),
                color: role?.color || info?.color || "",
                backgroundColor: role?.background_color || role?.bg_color || info?.background_color || info?.bg_color || "",
                borderColor: role?.border_color || info?.border_color || "",
            };
        },
        normalizeAsset: function (url) {
            if (!url) return "";
            url = String(url).trim();
            if (/^(https?:)?\/\//.test(url)) return url;
            return __cdn + url.replace(/^\/+/, "");
        },
        normalizeIcon: function (role, info) {
            const mount = role?.mount || role?.school || role?.school_id || info?.mount || info?.school || info?.school_id || "";
            if (mount) return showSchoolIcon(mount);

            return this.normalizeAsset(role?.icon || role?.logo || role?.image || info?.icon || info?.logo || "");
        },
        normalizeLink: function (url) {
            if (!url) return "";
            url = String(url).trim();
            if (/^(https?:)?\/\//.test(url)) return url;
            return __Root + url.replace(/^\/+/, "");
        },
        roleStyle: function (role) {
            return {
                color: role.color || null,
                backgroundColor: role.backgroundColor || null,
                borderColor: role.borderColor || null,
            };
        },
    },
};
</script>

<style lang="less">
/* src/author/AuthorRole.vue */
.c-author-role {
    .u-roles {
        display: flex;
        flex-direction: column;
        gap: 7px;
        margin-top: 2px;
    }
    .u-role {
        .flex(y);
        gap: 8px;
        max-width: 100%;
        min-height: 22px;
        color: #56677a;
        font-size: 13px;
        line-height: 22px;
        box-sizing: border-box;
        text-decoration: none;
    }
    a.u-role {
        &:hover {
            .u-role-name {
                color: @v4primary;
            }
            .u-role-server {
                color: fade(@v4primary, 65%);
            }
        }
    }
    .u-role-icon {
        .size(22px);
        flex-shrink: 0;
        object-fit: contain;
    }
    .u-role-content {
        min-width: 0;
        display: flex;
        align-items: baseline;
    }
    .u-role-name {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #42566d;
        font-weight: 400;
        font-size: 12px;
        margin-right: 2px;
    }
    .u-role-server {
        flex-shrink: 0;
        // color: #9aa7b5;
        color: @v4yellow;
        font-size: 12px;
        font-weight: 400;
    }
}
</style>
