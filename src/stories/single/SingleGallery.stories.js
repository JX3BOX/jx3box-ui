
import StoryPropsTable from '../components/StoryPropsTable.vue';
import SingleAuthor from '../../single/Author.vue';
import CmsSingle from '../../single/CmsSingle.vue';
import Collection from '../../single/Collection.vue';
import Comment from '../../single/Comment.vue';
import Creators from '../../single/Creators.vue';
import PostDirectory from '../../single/PostDirectory.vue';
import PostHeader from '../../single/PostHeader.vue';
import SimpleThx from '../../single/SimpleThx.vue';
import Thx from '../../single/Thx.vue';
import { mockPost, mockStat } from '../mockData';

const meta = {
    title: 'Single/Index',
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;

export const Overview = {
    render: () => ({
        components: {
            CmsSingle,
            PostHeader,
            Creators,
            Collection,
            PostDirectory,
            StoryPropsTable,
        },
        setup() {
            return {
                mockPost,
                mockStat,
                singleProps: [
                    {
                        title: 'CmsSingle',
                        description: '单页整合容器，通常只要给 post 和 stat 就能跑起来。',
                        items: [
                            { name: 'post', type: 'Object', default: '{}', required: true, description: '文章主体数据，包含标题、正文、作者、评论开关等字段。' },
                            { name: 'stat', type: 'Object', default: '{}', description: '统计信息，常用为浏览量 views。' },
                        ],
                    },
                    {
                        title: 'PostHeader',
                        description: '单页头部信息组件。',
                        items: [
                            { name: 'post', type: 'Object', default: '{}', required: true, description: '文章标题、作者、客户端、发布时间等信息来源。' },
                            { name: 'stat', type: 'Object', default: '{}', description: '展示浏览量。' },
                            { name: 'titleExtra', type: 'String', default: '""', description: '是否展示扩展标题标签。' },
                            { name: 'anonymous', type: 'Boolean', default: 'false', description: '是否匿名展示作者。' },
                        ],
                    },
                    {
                        title: 'Creators / Collection / Article / Comment / Thx',
                        description: '这些组件大多围绕文章 ID、类型和正文工作。',
                        items: [
                            { name: 'postId / id', type: 'Number | String', default: '0', required: true, description: '文章或集合主键。' },
                            { name: 'postType / category', type: 'String', default: '""', required: true, description: '文章类型，例如 bbs、article。' },
                            { name: 'content', type: 'String', default: '""', description: 'Article 正文 HTML。' },
                            { name: 'userId', type: 'Number | String', default: '0', description: '用于 Thx / SimpleThx 的作者 UID。' },
                        ],
                    },
                    {
                        title: 'Author',
                        description: '详情页左侧作者整合模块。',
                        items: [
                            { name: 'uid', type: 'Number | String', default: '0', required: true, description: '作者 UID。' },
                            { name: 'anonymous', type: 'Number | String', default: '0', description: '是否匿名模式。' },
                        ],
                    },
                ],
            };
        },
        template: `
            <div style="display: grid; gap: 24px;">
                <section style="border-radius: 20px; background: rgba(255,255,255,0.92); padding: 24px; box-shadow: 0 24px 60px rgba(15,23,42,0.08);">
                    <div style="font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #0ea5e9;">single</div>
                    <h2 style="margin: 10px 0 0; font-size: 28px; color: #0f172a;">内容单页组件总览</h2>
                    <p style="margin-top: 12px; color: #475569; line-height: 1.8;">这里集中展示 README 里的单页内容组件，方便在 Storybook 中快速查看组合效果。</p>
                </section>

                <section style="border-radius: 20px; background: rgba(255,255,255,0.92); padding: 24px; box-shadow: 0 24px 60px rgba(15,23,42,0.08);">
                    <h3 style="margin: 0 0 16px; font-size: 20px; color: #0f172a;">PostHeader + Creators + Collection + Article + PostDirectory</h3>
                    <PostHeader :post="mockPost" :stat="mockStat" title-extra="1" />
                    <Creators :post-id="mockPost.ID" :post-type="mockPost.post_type" />
                    <Collection :id="mockPost.post_collection" :default-visible="true" />
                    <Article :content="mockPost.post_content" :pageable="false" />
                    <div style="margin-top: 20px; padding: 16px; border: 1px dashed rgba(15,23,42,0.15); border-radius: 16px;">
                        <div style="font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 10px;">PostDirectory</div>
                        <PostDirectory />
                        <div class="c-article-directory" style="margin-top: 8px;">
                            <h2>版本概览</h2>
                            <h3 class="lv2">核心思路</h3>
                            <h3 class="lv2">配装建议</h3>
                        </div>
                    </div>
                </section>

                <section style="border-radius: 20px; background: rgba(255,255,255,0.92); padding: 24px; box-shadow: 0 24px 60px rgba(15,23,42,0.08);">
                    <h3 style="margin: 0 0 16px; font-size: 20px; color: #0f172a;">CmsSingle</h3>
                    <CmsSingle :post="mockPost" :stat="mockStat" />
                </section>

                <StoryPropsTable
                    v-for="item in singleProps"
                    :key="item.title"
                    :title="item.title"
                    :description="item.description"
                    :items="item.items"
                />
            </div>
        `,
    }),
};

export const Interactive = {
    render: () => ({
        components: {
            SingleAuthor,
            SimpleThx,
            Thx,
            Comment,
            StoryPropsTable,
        },
        data() {
            return {
                interactiveProps: [
                    {
                        title: 'SimpleThx / Thx',
                        description: '互动组件需要文章标识和作者信息；如果要在 Storybook 中可见，建议同时给开关类 props。',
                        items: [
                            { name: 'postId', type: 'Number | String', default: '0', required: true, description: '当前文章 ID。' },
                            { name: 'postType', type: 'String', default: '""', required: true, description: '文章类型。' },
                            { name: 'postTitle', type: 'String', default: '""', description: '展示和收藏用标题。' },
                            { name: 'userId', type: 'Number | String', default: '0', description: '文章作者 UID。' },
                            { name: 'adminBoxcoinEnable / userBoxcoinEnable', type: 'Boolean', default: 'false', description: '控制打赏模块显示。' },
                        ],
                    },
                    {
                        title: 'Comment',
                        description: '评论组件依赖评论目标分类和目标 ID。',
                        items: [
                            { name: 'id', type: 'Number | String', default: '0', required: true, description: '评论目标 ID。' },
                            { name: 'category', type: 'String', default: '""', required: true, description: '评论分类，例如 post。' },
                            { name: 'normal', type: 'Boolean', default: 'true', description: '普通评论模式。' },
                            { name: 'order', type: 'String', default: '""', description: '初始排序模式。' },
                        ],
                    },
                ],
            };
        },
        template: `
            <div style="display: grid; gap: 24px;">
                <section style="border-radius: 20px; background: rgba(255,255,255,0.92); padding: 24px; box-shadow: 0 24px 60px rgba(15,23,42,0.08);">
                    <h3 style="margin: 0 0 16px; font-size: 20px; color: #0f172a;">Author</h3>
                    <div style="max-width: 320px;">
                        <SingleAuthor :uid="8" />
                    </div>
                </section>

                <section style="border-radius: 20px; background: rgba(255,255,255,0.92); padding: 24px; box-shadow: 0 24px 60px rgba(15,23,42,0.08);">
                    <h3 style="margin: 0 0 16px; font-size: 20px; color: #0f172a;">SimpleThx / Thx</h3>
                    <div style="display: grid; gap: 18px;">
                        <SimpleThx
                            post-type="bbs"
                            post-title="轻剑驭风版本攻略示例"
                            :post-id="80449"
                            :user-id="8"
                            :admin-boxcoin-enable="true"
                            :user-boxcoin-enable="true"
                            :allow-gift="true"
                            :preset-config="{ admin_max: 1000, admin_min: 10, admin_points: [10,50,100], admin_left: 4800, admin_total: 10000, user_points: [10,20,50], user_left: 820, boxcoin_enable: 1 }"
                        />
                        <Thx
                            post-type="bbs"
                            post-title="轻剑驭风版本攻略示例"
                            :post-id="80449"
                            :user-id="8"
                            :admin-boxcoin-enable="true"
                            :user-boxcoin-enable="true"
                            :allow-gift="true"
                            :show-rss="true"
                            author-id="8"
                            category="post"
                        />
                    </div>
                </section>

                <section style="border-radius: 20px; background: rgba(255,255,255,0.92); padding: 24px; box-shadow: 0 24px 60px rgba(15,23,42,0.08);">
                    <h3 style="margin: 0 0 16px; font-size: 20px; color: #0f172a;">Comment</h3>
                    <Comment category="post" :id="80449" />
                </section>

                <StoryPropsTable
                    v-for="item in interactiveProps"
                    :key="item.title"
                    :title="item.title"
                    :description="item.description"
                    :items="item.items"
                />
            </div>
        `,
    }),
};
