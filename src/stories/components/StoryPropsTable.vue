<template>
    <section class="story-props-table">
        <div class="story-props-table__header">
            <div>
                <div class="story-props-table__eyebrow">Props</div>
                <h3 class="story-props-table__title">{{ title }}</h3>
            </div>
            <p v-if="description" class="story-props-table__desc">{{ description }}</p>
        </div>

        <div class="story-props-table__body">
            <table>
                <thead>
                    <tr>
                        <th>Prop</th>
                        <th>类型</th>
                        <th>默认值</th>
                        <th>说明</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in items" :key="item.name">
                        <td>
                            <code>{{ item.name }}</code>
                            <span v-if="item.required" class="story-props-table__required">必填</span>
                        </td>
                        <td>{{ item.type || '-' }}</td>
                        <td><code>{{ item.default ?? '-' }}</code></td>
                        <td>{{ item.description || '-' }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
</template>

<script>
export default {
    name: "StoryPropsTable",
    props: {
        title: {
            type: String,
            default: "组件 Props",
        },
        description: {
            type: String,
            default: "",
        },
        items: {
            type: Array,
            default: function () {
                return [];
            },
        },
    },
};
</script>

<style lang="less">
.story-props-table {
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.92);
    box-shadow: 0 24px 60px rgba(15, 23, 42, 0.08);
    overflow: hidden;
}

.story-props-table__header {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    padding: 24px 24px 18px;
    border-bottom: 1px solid rgba(15, 23, 42, 0.08);
}

.story-props-table__eyebrow {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #0ea5e9;
}

.story-props-table__title {
    margin: 8px 0 0;
    font-size: 22px;
    color: #0f172a;
}

.story-props-table__desc {
    max-width: 28rem;
    margin: 0;
    font-size: 14px;
    line-height: 1.8;
    color: #64748b;
}

.story-props-table__body {
    overflow-x: auto;
}

.story-props-table table {
    width: 100%;
    border-collapse: collapse;
}

.story-props-table th,
.story-props-table td {
    padding: 14px 16px;
    border-bottom: 1px solid rgba(15, 23, 42, 0.06);
    text-align: left;
    font-size: 13px;
    line-height: 1.7;
    color: #334155;
    vertical-align: top;
}

.story-props-table th {
    font-weight: 700;
    color: #0f172a;
    background: rgba(248, 250, 252, 0.9);
}

.story-props-table code {
    padding: 2px 6px;
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.06);
    color: #0f172a;
}

.story-props-table__required {
    display: inline-block;
    margin-left: 8px;
    font-size: 11px;
    color: #b91c1c;
    font-weight: 700;
}
</style>
